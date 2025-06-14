import { supabaseService } from '../../services/supabase.js';
import { logger } from '../../utils/common/logger.js';

export interface Lead {
  id: string;
  tenant_id: string;
  email: string;
  first_name: string;
  last_name: string;
  company: string;
  job_title: string;
  status: string;
  source: string;
  priority: string;
  score: number;
  tags: string[];
  last_contacted_at?: string;
  next_follow_up_at?: string;
  created_at: string;
  updated_at: string;
}

export async function getLeadById(tenantId: string, leadId: string): Promise<Lead | null> {
  try {
    const result = await supabaseService.query('leads', {
      filters: { id: leadId, tenant_id: tenantId },
      limit: 1
    });
    if (!result.data || result.data.length === 0) return null;
    return result.data[0] as Lead;
  } catch (error: any) {
    logger.error('[DAL] getLeadById failed', { error: error.message, leadId, tenantId });
    throw error;
  }
}

export async function listLeads(tenantId: string, filters: Partial<Lead> = {}, limit = 50, offset = 0): Promise<Lead[]> {
  try {
    const result = await supabaseService.query('leads', {
      filters: { ...filters, tenant_id: tenantId },
      limit,
      offset
    });
    return result.data as Lead[];
  } catch (error: any) {
    logger.error('[DAL] listLeads failed', { error: error.message, tenantId });
    throw error;
  }
}

export async function createLead(tenantId: string, lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Promise<Lead> {
  try {
    const now = new Date().toISOString();
    const result = await supabaseService.insert('leads', {
      ...lead,
      tenant_id: tenantId,
      created_at: now,
      updated_at: now
    }, undefined);
    return result.data as Lead;
  } catch (error: any) {
    logger.error('[DAL] createLead failed', { error: error.message, tenantId, email: lead.email });
    throw error;
  }
}

export async function updateLead(tenantId: string, leadId: string, updates: Partial<Lead>): Promise<Lead> {
  try {
    const result = await supabaseService.update('leads', leadId, {
      ...updates,
      updated_at: new Date().toISOString()
    }, undefined);
    return result.data as Lead;
  } catch (error: any) {
    logger.error('[DAL] updateLead failed', { error: error.message, leadId, tenantId });
    throw error;
  }
}

export async function deleteLead(tenantId: string, leadId: string): Promise<boolean> {
  try {
    await supabaseService.delete('leads', leadId, undefined);
    return true;
  } catch (error: any) {
    logger.error('[DAL] deleteLead failed', { error: error.message, leadId, tenantId });
    throw error;
  }
}

export async function bulkCreateLeads(tenantId: string, leads: Omit<Lead, 'id' | 'created_at' | 'updated_at'>[]): Promise<Lead[]> {
  try {
    const now = new Date().toISOString();
    const leadsToInsert = leads.map(lead => ({
      ...lead,
      tenant_id: tenantId,
      created_at: now,
      updated_at: now
    }));
    const result = await supabaseService.insert('leads', leadsToInsert, undefined);
    return result.data as Lead[];
  } catch (error: any) {
    logger.error('[DAL] bulkCreateLeads failed', { error: error.message, tenantId });
    throw error;
  }
}

/**
 * Cuenta leads agrupados por un campo (status, source, priority, etc)
 */
export async function countLeadsByField(tenantId: string, field: keyof Lead): Promise<Record<string, number>> {
  try {
    const { data, error } = await supabaseService.adminClient
      .from('leads')
      .select(`${field}, count:id`, { groupBy: field })
      .eq('tenant_id', tenantId);
    if (error) throw error;
    const counts: Record<string, number> = {};
    for (const row of data) {
      counts[row[field]] = row.count;
    }
    return counts;
  } catch (error: any) {
    logger.error('[DAL] countLeadsByField failed', { error: error.message, tenantId, field });
    throw error;
  }
}

/**
 * Obtiene los leads más recientes para un tenant
 */
export async function getRecentLeads(tenantId: string, limit = 5): Promise<Lead[]> {
  try {
    const result = await supabaseService.query('leads', {
      filters: { tenant_id: tenantId },
      sortBy: 'created_at',
      sortOrder: 'desc',
      limit
    });
    return result.data as Lead[];
  } catch (error: any) {
    logger.error('[DAL] getRecentLeads failed', { error: error.message, tenantId });
    throw error;
  }
} 