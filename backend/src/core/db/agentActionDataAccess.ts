import { supabaseService } from '../../services/supabase.js';
import { logger } from '../../utils/common/logger.js';

export interface AgentAction {
  id: string;
  tenant_id: string;
  action_type: string;
  agent_id: string;
  agent_name: string;
  agent_version: string;
  priority: string;
  priority_score: number;
  status: string;
  payload: any;
  context: any;
  results: any;
  target_type?: string;
  target_id?: string;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

export async function getAgentActionById(tenantId: string, actionId: string): Promise<AgentAction | null> {
  try {
    const result = await supabaseService.query('agent_actions', {
      filters: { id: actionId, tenant_id: tenantId },
      limit: 1
    });
    if (!result.data || result.data.length === 0) return null;
    return result.data[0] as AgentAction;
  } catch (error: any) {
    logger.error('[DAL] getAgentActionById failed', { error: error.message, actionId, tenantId });
    throw error;
  }
}

export async function listAgentActions(tenantId: string, filters: Partial<AgentAction> = {}, limit = 50, offset = 0): Promise<AgentAction[]> {
  try {
    const result = await supabaseService.query('agent_actions', {
      filters: { ...filters, tenant_id: tenantId },
      limit,
      offset
    });
    return result.data as AgentAction[];
  } catch (error: any) {
    logger.error('[DAL] listAgentActions failed', { error: error.message, tenantId });
    throw error;
  }
}

export async function createAgentAction(tenantId: string, action: Omit<AgentAction, 'id' | 'created_at' | 'updated_at'>): Promise<AgentAction> {
  try {
    const now = new Date().toISOString();
    const result = await supabaseService.insert('agent_actions', {
      ...action,
      tenant_id: tenantId,
      created_at: now,
      updated_at: now
    }, tenantId);
    return result.data as AgentAction;
  } catch (error: any) {
    logger.error('[DAL] createAgentAction failed', { error: error.message, tenantId, action_type: action.action_type });
    throw error;
  }
}

export async function updateAgentAction(tenantId: string, actionId: string, updates: Partial<AgentAction>): Promise<AgentAction> {
  try {
    const result = await supabaseService.update('agent_actions', actionId, {
      ...updates,
      updated_at: new Date().toISOString()
    }, tenantId);
    return result.data as AgentAction;
  } catch (error: any) {
    logger.error('[DAL] updateAgentAction failed', { error: error.message, actionId, tenantId });
    throw error;
  }
}

export async function deleteAgentAction(tenantId: string, actionId: string): Promise<boolean> {
  try {
    await supabaseService.delete('agent_actions', actionId, tenantId);
    return true;
  } catch (error: any) {
    logger.error('[DAL] deleteAgentAction failed', { error: error.message, actionId, tenantId });
    throw error;
  }
} 