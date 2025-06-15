/**
 * Authentication middleware for JWT and API key validation
 */

import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '../services/supabase.js';
import { logger } from '../utils/common/logger.js';
import { UnauthorizedError, ForbiddenError } from '../utils/common/errorHandler.ts';

/**
 * JWT authentication middleware for frontend users
 */
export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authorization token required');
    }

    const token = authHeader.substring(7);

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedError('Token expired');
      }
      throw new UnauthorizedError('Invalid token');
    }

    // Get user from Supabase
    const { data: user, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', decoded.sub)
      .single();

    if (error || !user) {
      throw new UnauthorizedError('User not found');
    }

    // Add user to request
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      tenantId: decoded.tenantId // From JWT claims
    };

    // Add session info
    req.session = {
      access_token: token,
      user: req.user
    };

    logger.debug('JWT authentication successful', {
      userId: user.id,
      email: user.email,
      requestId: req.id
    });

    next();
  } catch (error) {
    logger.warn('JWT authentication failed', {
      error: error.message,
      requestId: req.id,
      path: req.path
    });
    next(error);
  }
};

/**
 * API key authentication middleware for CURSOR agents
 */
export const apiKeyMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const apiKeyHeader = req.headers['x-api-key'];
    
    // Check for API key in Authorization header or X-API-Key header
    let apiKey;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      apiKey = authHeader.substring(7);
    } else if (apiKeyHeader) {
      apiKey = apiKeyHeader;
    }

    if (!apiKey) {
      throw new UnauthorizedError('API key required');
    }

    // Check for default CURSOR API key
    if (apiKey === process.env.AGENT_SECRET_TOKEN) {
      // Default CURSOR API key - has access to all tenants
      req.apiKey = {
        id: 'default-cursor-key',
        tenantId: null, // Will be set by tenant middleware
        isActive: true,
        permissions: ['*'],
        name: 'Default CURSOR API Key',
        type: 'system'
      };

      req.agent = {
        id: req.headers['x-agent-id'] || 'cursor-agent',
        type: 'cursor',
        version: '1.0.0'
      };

      logger.debug('Default CURSOR API key authentication successful', {
        agentId: req.agent.id,
        requestId: req.id
      });

      return next();
    }

    // Check for tenant-specific API key
    const { data: apiKeyData, error } = await supabaseAdmin
      .from('api_keys')
      .select(`
        *,
        tenants!inner(
          id,
          name,
          slug,
          is_active
        )
      `)
      .eq('key_hash', this.hashApiKey(apiKey))
      .eq('is_active', true)
      .single();

    if (error || !apiKeyData) {
      throw new UnauthorizedError('Invalid API key');
    }

    // Check if API key is expired
    if (apiKeyData.expires_at && new Date(apiKeyData.expires_at) < new Date()) {
      throw new UnauthorizedError('API key expired');
    }

    // Check if tenant is active
    if (!apiKeyData.tenants.is_active) {
      throw new ForbiddenError('Tenant is inactive');
    }

    // Add API key info to request
    req.apiKey = {
      id: apiKeyData.id,
      tenantId: apiKeyData.tenant_id,
      isActive: apiKeyData.is_active,
      permissions: apiKeyData.permissions || [],
      name: apiKeyData.name,
      type: 'tenant'
    };

    req.agent = {
      id: req.headers['x-agent-id'] || 'unknown-agent',
      type: 'api',
      version: '1.0.0'
    };

    // Update last used timestamp
    await supabaseAdmin
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', apiKeyData.id);

    logger.debug('API key authentication successful', {
      apiKeyId: apiKeyData.id,
      tenantId: apiKeyData.tenant_id,
      agentId: req.agent.id,
      requestId: req.id
    });

    next();
  } catch (error) {
    logger.warn('API key authentication failed', {
      error: error.message,
      requestId: req.id,
      path: req.path
    });
    next(error);
  }
};

/**
 * Hash API key for storage
 */
function hashApiKey(apiKey) {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(apiKey).digest('hex');
}

/**
 * Middleware to check if user has specific role
 */
export const requireRole = (roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      const userRoles = Array.isArray(roles) ? roles : [roles];
      
      if (!userRoles.includes(req.user.role)) {
        throw new ForbiddenError(`Required role: ${userRoles.join(' or ')}`);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Optional authentication middleware
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // No authentication provided, continue
    }

    // Try to authenticate but don't fail if it doesn't work
    await authMiddleware(req, res, (error) => {
      if (error) {
        // Log the error but don't fail the request
        logger.debug('Optional authentication failed', {
          error: error.message,
          requestId: req.id
        });
      }
      next(); // Continue regardless of authentication result
    });
  } catch (error) {
    // Continue without authentication
    next();
  }
};

export default { authMiddleware, apiKeyMiddleware, requireRole, optionalAuth };