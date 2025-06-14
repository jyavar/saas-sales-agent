/**
 * Tenant model and validation schemas
 */

import { z } from 'zod';

// Tenant status constants
export const TENANT_STATUS = {
  ACTIVE: 'active',
  TRIAL: 'trial',
  SUSPENDED: 'suspended',
  CANCELLED: 'cancelled'
};

// Tenant plan constants
export const TENANT_PLAN = {
  FREE: 'free',
  STARTER: 'starter',
  PRO: 'pro',
  ENTERPRISE: 'enterprise'
};

// Validation schemas
export const tenantSchemas = {
  create: z.object({
    name: z.string().min(1, 'Tenant name required').max(100, 'Name too long'),
    slug: z.string()
      .min(1, 'Slug required')
      .max(50, 'Slug too long')
      .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
    plan: z.enum(Object.values(TENANT_PLAN)).default(TENANT_PLAN.FREE),
    settings: z.object({
      features: z.object({
        aiAgents: z.boolean().default(true),
        campaigns: z.boolean().default(true),
        analytics: z.boolean().default(true),
        webhooks: z.boolean().default(true),
        apiAccess: z.boolean().default(true)
      }).optional(),
      branding: z.object({
        primaryColor: z.string().optional(),
        secondaryColor: z.string().optional(),
        logo: z.string().url().optional()
      }).optional(),
      notifications: z.object({
        email: z.boolean().default(true),
        webhook: z.boolean().default(false),
        slack: z.boolean().default(false)
      }).optional()
    }).optional()
  }),

  update: z.object({
    name: z.string().min(1).max(100).optional(),
    settings: z.object({
      features: z.object({
        aiAgents: z.boolean().optional(),
        campaigns: z.boolean().optional(),
        analytics: z.boolean().optional(),
        webhooks: z.boolean().optional(),
        apiAccess: z.boolean().optional()
      }).optional(),
      branding: z.object({
        primaryColor: z.string().optional(),
        secondaryColor: z.string().optional(),
        logo: z.string().url().optional()
      }).optional(),
      notifications: z.object({
        email: z.boolean().optional(),
        webhook: z.boolean().optional(),
        slack: z.boolean().optional()
      }).optional()
    }).optional()
  }),

  inviteMember: z.object({
    email: z.string().email('Valid email required'),
    role: z.enum(['admin', 'user']).default('user'),
    message: z.string().optional()
  }),

  updateMember: z.object({
    role: z.enum(['admin', 'user']),
    isActive: z.boolean().optional()
  }),

  createApiKey: z.object({
    name: z.string().min(1, 'API key name required').max(100, 'Name too long'),
    permissions: z.array(z.string()).default(['leads:read', 'api:access']),
    expiresAt: z.string().datetime().optional()
  })
};

// Tenant helper functions
export const tenantHelpers = {
  /**
   * Generate slug from tenant name
   */
  generateSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  },

  /**
   * Get plan limits
   */
  getPlanLimits(plan) {
    const limits = {
      [TENANT_PLAN.FREE]: {
        maxUsers: 2,
        maxLeads: 100,
        maxCampaigns: 1,
        maxApiCalls: 1000,
        maxStorage: 100 // MB
      },
      [TENANT_PLAN.STARTER]: {
        maxUsers: 5,
        maxLeads: 1000,
        maxCampaigns: 10,
        maxApiCalls: 10000,
        maxStorage: 1000 // MB
      },
      [TENANT_PLAN.PRO]: {
        maxUsers: 25,
        maxLeads: 10000,
        maxCampaigns: 100,
        maxApiCalls: 100000,
        maxStorage: 10000 // MB
      },
      [TENANT_PLAN.ENTERPRISE]: {
        maxUsers: -1, // Unlimited
        maxLeads: -1,
        maxCampaigns: -1,
        maxApiCalls: -1,
        maxStorage: -1
      }
    };

    return limits[plan] || limits[TENANT_PLAN.FREE];
  },

  /**
   * Check if tenant has reached a specific limit
   */
  hasReachedLimit(tenant, limitType, currentCount) {
    const limits = this.getPlanLimits(tenant.plan);
    const limit = limits[limitType];
    
    // Unlimited
    if (limit === -1) {
      return false;
    }
    
    return currentCount >= limit;
  },

  /**
   * Check if tenant is active
   */
  isActive(tenant) {
    return tenant.status === TENANT_STATUS.ACTIVE;
  },

  /**
   * Check if tenant is in trial
   */
  isInTrial(tenant) {
    return tenant.status === TENANT_STATUS.TRIAL;
  },

  /**
   * Check if trial is expired
   */
  isTrialExpired(tenant) {
    if (tenant.status !== TENANT_STATUS.TRIAL) {
      return false;
    }
    
    if (!tenant.trialEndsAt) {
      return false;
    }
    
    return new Date(tenant.trialEndsAt) < new Date();
  },

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
        secondaryColor: '#64748b'
      },
      notifications: {
        email: true,
        webhook: false,
        slack: false
      }
    };
  },

  /**
   * Validate tenant slug availability
   */
  isValidSlug(slug) {
    // Reserved slugs
    const reserved = [
      'www', 'api', 'app', 'admin', 'dashboard', 'docs', 'help', 'support',
      'blog', 'status', 'mail', 'email', 'ftp', 'cdn', 'assets', 'static'
    ];
    
    if (reserved.includes(slug)) {
      return false;
    }
    
    // Check format
    return /^[a-z0-9-]+$/.test(slug) && slug.length >= 3 && slug.length <= 50;
  }
};

export default {
  TENANT_STATUS,
  TENANT_PLAN,
  tenantSchemas,
  tenantHelpers
};