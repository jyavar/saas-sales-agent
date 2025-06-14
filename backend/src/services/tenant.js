/**
 * Tenant service for multi-tenant operations
 */

import { supabaseAdmin } from './supabase.js';
import { logger } from '../utils/common/logger.js';
import { DatabaseError, ValidationError } from '../utils/common/errorHandler.js';

export class TenantService {
  /**
   * Get tenant by ID
   */
  async getTenantById(tenantId) {
    try {
      const { data, error } = await supabaseAdmin
        .from('tenants')
        .select(`
          *,
          tenant_members!inner(
            user_id,
            role,
            is_active
          )
        `)
        .eq('id', tenantId)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        throw new DatabaseError('Failed to fetch tenant', error);
      }

      return this.formatTenant(data);
    } catch (error) {
      logger.error('Error fetching tenant by ID', {
        tenantId,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Get tenant by slug
   */
  async getTenantBySlug(slug) {
    try {
      const { data, error } = await supabaseAdmin
        .from('tenants')
        .select(`
          *,
          tenant_members!inner(
            user_id,
            role,
            is_active
          )
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        throw new DatabaseError('Failed to fetch tenant', error);
      }

      return this.formatTenant(data);
    } catch (error) {
      logger.error('Error fetching tenant by slug', {
        slug,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Check if user has access to tenant
   */
  async userHasAccessToTenant(userId, tenantId) {
    try {
      const { data, error } = await supabaseAdmin
        .from('tenant_members')
        .select('id')
        .eq('user_id', userId)
        .eq('tenant_id', tenantId)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new DatabaseError('Failed to check tenant access', error);
      }

      return !!data;
    } catch (error) {
      logger.error('Error checking tenant access', {
        userId,
        tenantId,
        error: error.message
      });
      return false;
    }
  }

  /**
   * Get user's tenants
   */
  async getUserTenants(userId) {
    try {
      const { data, error } = await supabaseAdmin
        .from('tenant_members')
        .select(`
          role,
          is_active,
          tenants!inner(
            id,
            name,
            slug,
            plan,
            status,
            settings,
            created_at
          )
        `)
        .eq('user_id', userId)
        .eq('is_active', true)
        .eq('tenants.is_active', true);

      if (error) {
        throw new DatabaseError('Failed to fetch user tenants', error);
      }

      return data.map(item => ({
        ...this.formatTenant(item.tenants),
        userRole: item.role
      }));
    } catch (error) {
      logger.error('Error fetching user tenants', {
        userId,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Check if tenant has specific permission
   */
  async tenantHasPermission(tenantId, permission) {
    try {
      const tenant = await this.getTenantById(tenantId);
      if (!tenant) {
        return false;
      }

      // Check plan-based permissions
      const planPermissions = this.getPlanPermissions(tenant.plan);
      return planPermissions.includes(permission);
    } catch (error) {
      logger.error('Error checking tenant permission', {
        tenantId,
        permission,
        error: error.message
      });
      return false;
    }
  }

  /**
   * Check resource limits for tenant
   */
  async checkResourceLimit(tenantId, resource, action = 'create') {
    try {
      const tenant = await this.getTenantById(tenantId);
      if (!tenant) {
        throw new ValidationError('Tenant not found');
      }

      const limits = this.getPlanLimits(tenant.plan);
      const limitKey = `max${resource.charAt(0).toUpperCase() + resource.slice(1)}`;
      const limit = limits[limitKey];

      // Unlimited for enterprise
      if (limit === -1) {
        return false;
      }

      // Get current count
      const currentCount = await this.getResourceCount(tenantId, resource);
      
      if (action === 'create') {
        return currentCount >= limit;
      }

      return false;
    } catch (error) {
      logger.error('Error checking resource limit', {
        tenantId,
        resource,
        action,
        error: error.message
      });
      return false;
    }
  }

  /**
   * Get current resource count for tenant
   */
  async getResourceCount(tenantId, resource) {
    try {
      const tableName = this.getResourceTableName(resource);
      
      const { count, error } = await supabaseAdmin
        .from(tableName)
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', tenantId);

      if (error) {
        throw new DatabaseError(`Failed to count ${resource}`, error);
      }

      return count || 0;
    } catch (error) {
      logger.error('Error getting resource count', {
        tenantId,
        resource,
        error: error.message
      });
      return 0;
    }
  }

  /**
   * Create new tenant
   */
  async createTenant(tenantData, ownerId) {
    try {
      const { data: tenant, error: tenantError } = await supabaseAdmin
        .from('tenants')
        .insert({
          name: tenantData.name,
          slug: tenantData.slug,
          owner_id: ownerId,
          plan: tenantData.plan || 'free',
          status: 'active',
          settings: {
            ...this.getDefaultSettings(),
            ...tenantData.settings
          }
        })
        .select()
        .single();

      if (tenantError) {
        throw new DatabaseError('Failed to create tenant', tenantError);
      }

      // Add owner as tenant member
      const { error: memberError } = await supabaseAdmin
        .from('tenant_members')
        .insert({
          tenant_id: tenant.id,
          user_id: ownerId,
          role: 'owner',
          is_active: true
        });

      if (memberError) {
        // Rollback tenant creation
        await supabaseAdmin.from('tenants').delete().eq('id', tenant.id);
        throw new DatabaseError('Failed to add tenant owner', memberError);
      }

      return this.formatTenant(tenant);
    } catch (error) {
      logger.error('Error creating tenant', {
        tenantData,
        ownerId,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Format tenant data
   */
  formatTenant(tenant) {
    return {
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      plan: tenant.plan,
      status: tenant.status,
      isActive: tenant.status === 'active',
      settings: tenant.settings || {},
      planLimits: this.getPlanLimits(tenant.plan),
      createdAt: tenant.created_at,
      updatedAt: tenant.updated_at
    };
  }

  /**
   * Get plan limits
   */
  getPlanLimits(plan) {
    const limits = {
      free: {
        maxUsers: 2,
        maxLeads: 100,
        maxCampaigns: 1,
        maxApiCalls: 1000,
        maxStorage: 100 // MB
      },
      starter: {
        maxUsers: 5,
        maxLeads: 1000,
        maxCampaigns: 10,
        maxApiCalls: 10000,
        maxStorage: 1000 // MB
      },
      pro: {
        maxUsers: 25,
        maxLeads: 10000,
        maxCampaigns: 100,
        maxApiCalls: 100000,
        maxStorage: 10000 // MB
      },
      enterprise: {
        maxUsers: -1, // Unlimited
        maxLeads: -1,
        maxCampaigns: -1,
        maxApiCalls: -1,
        maxStorage: -1
      }
    };

    return limits[plan] || limits.free;
  }

  /**
   * Get plan permissions
   */
  getPlanPermissions(plan) {
    const permissions = {
      free: ['leads:read', 'leads:create', 'campaigns:read'],
      starter: ['leads:*', 'campaigns:*', 'analytics:read'],
      pro: ['leads:*', 'campaigns:*', 'analytics:*', 'api:access'],
      enterprise: ['*'] // All permissions
    };

    return permissions[plan] || permissions.free;
  }

  /**
   * Get default tenant settings
   */
  getDefaultSettings() {
    return {
      features: {
        aiAgents: true,
        campaigns: true,
        analytics: true,
        webhooks: true,
        apiAccess: true
      },
      branding: {
        primaryColor: '#3b82f6',
        secondaryColor: '#64748b',
        logo: null
      },
      notifications: {
        email: true,
        webhook: false,
        slack: false
      }
    };
  }

  /**
   * Get resource table name
   */
  getResourceTableName(resource) {
    const tableMap = {
      users: 'tenant_members',
      leads: 'leads',
      campaigns: 'campaigns',
      apiKeys: 'api_keys'
    };

    return tableMap[resource] || resource;
  }
}

export const tenantService = new TenantService();
export default tenantService;