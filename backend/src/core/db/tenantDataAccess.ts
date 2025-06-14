import { supabaseService } from '../../services/supabase.js';
import { logger } from '../../utils/common/logger.js';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: string;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

export async function getTenantById(tenantId: string): Promise<Tenant | null> {
  try {
    const result = await supabaseService.query('tenants', {
      filters: { id: tenantId },
      limit: 1
    });
    if (!result.data || result.data.length === 0) return null;
    return result.data[0] as Tenant;
  } catch (error: any) {
    logger.error('[DAL] getTenantById failed', { error: error.message, tenantId });
    throw error;
  }
}

export async function listTenants(filters: Partial<Tenant> = {}, limit = 50, offset = 0): Promise<Tenant[]> {
  try {
    const result = await supabaseService.query('tenants', {
      filters,
      limit,
      offset
    });
    return result.data as Tenant[];
  } catch (error: any) {
    logger.error('[DAL] listTenants failed', { error: error.message });
    throw error;
  }
}

export async function createTenant(tenant: Omit<Tenant, 'id' | 'created_at' | 'updated_at'>): Promise<Tenant> {
  try {
    const now = new Date().toISOString();
    const result = await supabaseService.insert('tenants', {
      ...tenant,
      created_at: now,
      updated_at: now
    }, null);
    return result.data as Tenant;
  } catch (error: any) {
    logger.error('[DAL] createTenant failed', { error: error.message, name: tenant.name });
    throw error;
  }
}

export async function updateTenant(tenantId: string, updates: Partial<Tenant>): Promise<Tenant> {
  try {
    const result = await supabaseService.update('tenants', tenantId, {
      ...updates,
      updated_at: new Date().toISOString()
    }, null);
    return result.data as Tenant;
  } catch (error: any) {
    logger.error('[DAL] updateTenant failed', { error: error.message, tenantId });
    throw error;
  }
}

export async function deleteTenant(tenantId: string): Promise<boolean> {
  try {
    await supabaseService.delete('tenants', tenantId, null);
    return true;
  } catch (error: any) {
    logger.error('[DAL] deleteTenant failed', { error: error.message, tenantId });
    throw error;
  }
} 