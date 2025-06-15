/**
 * API Key management service
 */

import { supabaseAdmin } from './supabase.js';
import { authService } from './auth.js';
import { logger } from '../utils/common/logger.js';
import { DatabaseError, ValidationError, NotFoundError } from '/backend/src/utils/common/errorHandler.js';

export class ApiKeyService {
  /**
   * Create new API key for tenant
   */
  async createApiKey(apiKeyData, createdBy, req = null) {
    try {
      // Generate API key
      const apiKey = authService.generateApiKey('sk_test');
      const keyHash = authService.hashApiKey(apiKey);

      // Set expiration (default 1 year)
      const expiresAt = apiKeyData.expiresAt || 
        new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

      const { data, error } = await supabaseAdmin
        .from('api_keys')
        .insert({
          tenant_id: apiKeyData.tenantId,
          name: apiKeyData.name,
          key_hash: keyHash,
          permissions: apiKeyData.permissions || [],
          expires_at: expiresAt,
          is_active: true,
          created_by: createdBy
        })
        .select()
        .single();

      if (error) {
        throw new DatabaseError('Failed to create API key', error);
      }

      logger.info('API key created', {
        apiKeyId: data.id,
        tenantId: apiKeyData.tenantId,
        name: apiKeyData.name,
        createdBy,
        requestId: req?.id
      });

      return {
        id: data.id,
        key: apiKey, // Only returned once
        name: data.name,
        permissions: data.permissions,
        expiresAt: data.expires_at,
        createdAt: data.created_at
      };
    } catch (error) {
      logger.error('API key creation failed', {
        error: error.message,
        tenantId: apiKeyData.tenantId,
        requestId: req?.id
      });
      throw error;
    }
  }

  /**
   * Get API keys for tenant
   */
  async getTenantApiKeys(tenantId, req = null) {
    try {
      const { data, error } = await supabaseAdmin
        .from('api_keys')
        .select(`
          id,
          name,
          permissions,
          last_used_at,
          expires_at,
          is_active,
          created_at,
          created_by
        `)
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new DatabaseError('Failed to fetch API keys', error);
      }

      return data.map(key => ({
        ...key,
        isExpired: key.expires_at && new Date(key.expires_at) < new Date(),
        lastUsed: key.last_used_at ? new Date(key.last_used_at) : null
      }));
    } catch (error) {
      logger.error('API keys fetch failed', {
        error: error.message,
        tenantId,
        requestId: req?.id
      });
      throw error;
    }
  }

  /**
   * Get API key by hash
   */
  async getApiKeyByHash(keyHash, req = null) {
    try {
      const { data, error } = await supabaseAdmin
        .from('api_keys')
        .select(`
          *,
          tenants!inner(
            id,
            name,
            slug,
            is_active,
            status
          )
        `)
        .eq('key_hash', keyHash)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        throw new DatabaseError('Failed to fetch API key', error);
      }

      // Check if expired
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        return null; // Expired
      }

      return {
        id: data.id,
        tenantId: data.tenant_id,
        name: data.name,
        permissions: data.permissions || [],
        isActive: data.is_active,
        tenant: data.tenants
      };
    } catch (error) {
      logger.error('API key fetch by hash failed', {
        error: error.message,
        requestId: req?.id
      });
      return null;
    }
  }

  /**
   * Update API key
   */
  async updateApiKey(keyId, updates, tenantId, req = null) {
    try {
      const { data, error } = await supabaseAdmin
        .from('api_keys')
        .update(updates)
        .eq('id', keyId)
        .eq('tenant_id', tenantId)
        .select()
        .single();

      if (error) {
        throw new DatabaseError('Failed to update API key', error);
      }

      logger.info('API key updated', {
        apiKeyId: keyId,
        tenantId,
        updates: Object.keys(updates),
        requestId: req?.id
      });

      return data;
    } catch (error) {
      logger.error('API key update failed', {
        error: error.message,
        keyId,
        tenantId,
        requestId: req?.id
      });
      throw error;
    }
  }

  /**
   * Revoke API key
   */
  async revokeApiKey(keyId, tenantId, req = null) {
    try {
      const { error } = await supabaseAdmin
        .from('api_keys')
        .update({ 
          is_active: false,
          revoked_at: new Date().toISOString()
        })
        .eq('id', keyId)
        .eq('tenant_id', tenantId);

      if (error) {
        throw new DatabaseError('Failed to revoke API key', error);
      }

      logger.info('API key revoked', {
        apiKeyId: keyId,
        tenantId,
        requestId: req?.id
      });

      return { success: true };
    } catch (error) {
      logger.error('API key revocation failed', {
        error: error.message,
        keyId,
        tenantId,
        requestId: req?.id
      });
      throw error;
    }
  }

  /**
   * Update last used timestamp
   */
  async updateLastUsed(keyId, req = null) {
    try {
      await supabaseAdmin
        .from('api_keys')
        .update({ last_used_at: new Date().toISOString() })
        .eq('id', keyId);

      logger.debug('API key last used updated', {
        apiKeyId: keyId,
        requestId: req?.id
      });
    } catch (error) {
      // Don't throw error for this operation
      logger.warn('Failed to update API key last used', {
        error: error.message,
        keyId,
        requestId: req?.id
      });
    }
  }

  /**
   * Check API key permissions
   */
  hasPermission(apiKey, requiredPermission) {
    if (!apiKey || !apiKey.permissions) {
      return false;
    }

    // Check for wildcard permission
    if (apiKey.permissions.includes('*')) {
      return true;
    }

    // Check for exact permission
    if (apiKey.permissions.includes(requiredPermission)) {
      return true;
    }

    // Check for wildcard in category (e.g., 'leads:*' for 'leads:create')
    const [category] = requiredPermission.split(':');
    if (apiKey.permissions.includes(`${category}:*`)) {
      return true;
    }

    return false;
  }

  /**
   * Validate API key format
   */
  validateApiKeyFormat(apiKey) {
    // Check if it's the default CURSOR key
    if (apiKey === process.env.AGENT_SECRET_TOKEN) {
      return { valid: true, type: 'system' };
    }

    // Check format: sk_test_[64 hex chars] or sk_live_[64 hex chars]
    const pattern = /^sk_(test|live)_[a-f0-9]{64}$/;
    
    if (!pattern.test(apiKey)) {
      return { valid: false, error: 'Invalid API key format' };
    }

    return { valid: true, type: 'tenant' };
  }

  /**
   * Get API key statistics
   */
  async getApiKeyStats(tenantId, req = null) {
    try {
      const { data, error } = await supabaseAdmin
        .from('api_keys')
        .select('id, is_active, last_used_at, expires_at')
        .eq('tenant_id', tenantId);

      if (error) {
        throw new DatabaseError('Failed to fetch API key stats', error);
      }

      const now = new Date();
      const stats = {
        total: data.length,
        active: data.filter(key => key.is_active).length,
        expired: data.filter(key => key.expires_at && new Date(key.expires_at) < now).length,
        recentlyUsed: data.filter(key => 
          key.last_used_at && 
          new Date(key.last_used_at) > new Date(now - 7 * 24 * 60 * 60 * 1000)
        ).length
      };

      return stats;
    } catch (error) {
      logger.error('API key stats fetch failed', {
        error: error.message,
        tenantId,
        requestId: req?.id
      });
      throw error;
    }
  }
}

export const apiKeyService = new ApiKeyService();
export default apiKeyService;