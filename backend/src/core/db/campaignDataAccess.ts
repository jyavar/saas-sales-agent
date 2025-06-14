import { supabaseService } from '../../services/supabase.js';
import { logger } from '../../utils/common/logger.js';

export interface Campaign {
  id: string;
  tenant_id: string;
  name: string;
  subject: string;
  content: string;
  status: string;
  schedule_at?: string;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

export async function getCampaignById(tenantId: string, campaignId: string): Promise<Campaign | null> {
  try {
    const result = await supabaseService.query('campaigns', {
      filters: { id: campaignId, tenant_id: tenantId },
      limit: 1
    });
    if (!result.data || result.data.length === 0) return null;
    return result.data[0] as Campaign;
  } catch (error: any) {
    logger.error('[DAL] getCampaignById failed', { error: error.message, campaignId, tenantId });
    throw error;
  }
}

export async function listCampaigns(tenantId: string, filters: Partial<Campaign> = {}, limit = 50, offset = 0): Promise<Campaign[]> {
  try {
    const result = await supabaseService.query('campaigns', {
      filters: { ...filters, tenant_id: tenantId },
      limit,
      offset
    });
    return result.data as Campaign[];
  } catch (error: any) {
    logger.error('[DAL] listCampaigns failed', { error: error.message, tenantId });
    throw error;
  }
}

export async function createCampaign(tenantId: string, campaign: Omit<Campaign, 'id' | 'created_at' | 'updated_at'>): Promise<Campaign> {
  try {
    const now = new Date().toISOString();
    const result = await supabaseService.insert('campaigns', {
      ...campaign,
      tenant_id: tenantId,
      created_at: now,
      updated_at: now
    }, tenantId);
    return result.data as Campaign;
  } catch (error: any) {
    logger.error('[DAL] createCampaign failed', { error: error.message, tenantId, name: campaign.name });
    throw error;
  }
}

export async function updateCampaign(tenantId: string, campaignId: string, updates: Partial<Campaign>): Promise<Campaign> {
  try {
    const result = await supabaseService.update('campaigns', campaignId, {
      ...updates,
      updated_at: new Date().toISOString()
    }, tenantId);
    return result.data as Campaign;
  } catch (error: any) {
    logger.error('[DAL] updateCampaign failed', { error: error.message, campaignId, tenantId });
    throw error;
  }
}

export async function deleteCampaign(tenantId: string, campaignId: string): Promise<boolean> {
  try {
    await supabaseService.delete('campaigns', campaignId, tenantId);
    return true;
  } catch (error: any) {
    logger.error('[DAL] deleteCampaign failed', { error: error.message, campaignId, tenantId });
    throw error;
  }
} 