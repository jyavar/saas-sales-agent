/**
 * Multi-tenant middleware for detecting and validating tenant context
 */

import { tenantService } from '../services/tenant.js';
import { logger } from '../utils/common/logger.js';
import { ValidationError, UnauthorizedError, ForbiddenError } from '../utils/common/errorHandler.js';

/**
 * Extract tenant identifier from various sources
 * Priority: X-Tenant-ID header > JWT claims > hostname subdomain
 */
function extractTenantIdentifier(req) {
  // 1. Check X-Tenant-ID header (highest priority)
  const headerTenantId = req.headers['x-tenant-id'];
  if (headerTenantId) {
    return {
      identifier: headerTenantId,
      source: 'header',
      type: headerTenantId.includes('-') ? 'id' : 'slug'
    };
  }

  // 2. Check JWT claims (if user is authenticated)
  if (req.user && req.user.tenantId) {
    return {
      identifier: req.user.tenantId,
      source: 'jwt',
      type: 'id'
    };
  }

  // 3. Check hostname for subdomain (lowest priority)
  const hostname = req.hostname || req.headers.host?.split(':')[0];
  if (hostname && hostname !== 'localhost' && !hostname.includes('127.0.0.1')) {
    const parts = hostname.split('.');
    if (parts.length >= 3) { // subdomain.domain.tld
      const subdomain = parts[0];
      if (subdomain !== 'www' && subdomain !== 'api') {
        return {
          identifier: subdomain,
          source: 'subdomain',
          type: 'slug'
        };
      }
    }
  }

  return null;
}

/**
 * Validate tenant access for the current user/API key
 */
async function validateTenantAccess(tenant, req) {
  // For API key authentication (CURSOR agents)
  if (req.apiKey) {
    // Check if API key belongs to this tenant
    if (req.apiKey.tenantId !== tenant.id) {
      throw new ForbiddenError('API key does not have access to this tenant');
    }
    
    // Check if API key is active
    if (!req.apiKey.isActive) {
      throw new UnauthorizedError('API key is inactive');
    }
    
    return true;
  }

  // For JWT authentication (frontend users)
  if (req.user) {
    // Check if user has access to this tenant
    const hasAccess = await tenantService.userHasAccessToTenant(req.user.id, tenant.id);
    if (!hasAccess) {
      throw new ForbiddenError('User does not have access to this tenant');
    }
    
    return true;
  }

  // No authentication found
  throw new UnauthorizedError('Authentication required');
}

/**
 * Main tenant middleware
 */
export const tenantMiddleware = async (req, res, next) => {
  try {
    // Skip tenant validation for certain endpoints
    const skipTenantPaths = [
      '/api/docs',
      '/api/auth/register', // Registration creates tenant
      '/api/auth/login',    // Login doesn't require tenant context initially
      '/api/system'         // System endpoints
    ];

    const shouldSkip = skipTenantPaths.some(path => req.path.startsWith(path));
    if (shouldSkip) {
      return next();
    }

    // Extract tenant identifier
    const tenantInfo = extractTenantIdentifier(req);
    
    if (!tenantInfo) {
      throw new ValidationError('Tenant identifier required. Provide X-Tenant-ID header, authenticate with JWT, or use subdomain.');
    }

    // Resolve tenant from identifier
    let tenant;
    if (tenantInfo.type === 'id') {
      tenant = await tenantService.getTenantById(tenantInfo.identifier);
    } else {
      tenant = await tenantService.getTenantBySlug(tenantInfo.identifier);
    }

    if (!tenant) {
      throw new ValidationError(`Tenant not found: ${tenantInfo.identifier}`);
    }

    // Check if tenant is active
    if (!tenant.isActive) {
      throw new ForbiddenError('Tenant is inactive');
    }

    // Validate access permissions
    await validateTenantAccess(tenant, req);

    // Add tenant context to request
    req.tenant = tenant;
    req.tenantId = tenant.id;
    req.tenantSlug = tenant.slug;

    // Add tenant info to logs
    req.logContext = {
      ...req.logContext,
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      tenantSource: tenantInfo.source
    };

    logger.debug('Tenant context established', {
      requestId: req.id,
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      source: tenantInfo.source,
      identifier: tenantInfo.identifier
    });

    next();
  } catch (error) {
    logger.warn('Tenant middleware error', {
      requestId: req.id,
      error: error.message,
      path: req.path,
      headers: {
        'x-tenant-id': req.headers['x-tenant-id'],
        'host': req.headers.host
      }
    });
    
    next(error);
  }
};

/**
 * Middleware to require specific tenant permissions
 */
export const requireTenantPermission = (permission) => {
  return async (req, res, next) => {
    try {
      if (!req.tenant) {
        throw new ForbiddenError('Tenant context required');
      }

      // Check if tenant has the required permission
      const hasPermission = await tenantService.tenantHasPermission(req.tenant.id, permission);
      
      if (!hasPermission) {
        throw new ForbiddenError(`Tenant does not have permission: ${permission}`);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware to check tenant plan limits
 */
export const checkTenantLimits = (resource, action = 'create') => {
  return async (req, res, next) => {
    try {
      if (!req.tenant) {
        throw new ForbiddenError('Tenant context required');
      }

      // Check if tenant has reached limits for this resource
      const hasReachedLimit = await tenantService.checkResourceLimit(
        req.tenant.id, 
        resource, 
        action
      );

      if (hasReachedLimit) {
        throw new ForbiddenError(`Tenant has reached the limit for ${resource}. Upgrade your plan to continue.`);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default tenantMiddleware;