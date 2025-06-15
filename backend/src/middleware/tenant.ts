import { Request, Response, NextFunction } from 'express';
import { tenantService } from '../services/tenant.js';
import { logger } from '../utils/common/logger.js';
import { ValidationError, UnauthorizedError, ForbiddenError } from '../utils/common/errorHandler.js';

function extractTenantIdentifier(req: Request): { identifier: string; source: string; type: 'id' | 'slug' } | null {
  const headerTenantId = req.headers['x-tenant-id'] as string;
  if (headerTenantId) {
    return {
      identifier: headerTenantId,
      source: 'header',
      type: headerTenantId.includes('-') ? 'id' : 'slug'
    };
  }
  if (req.user && (req.user as any).tenantId) {
    return {
      identifier: (req.user as any).tenantId,
      source: 'jwt',
      type: 'id'
    };
  }
  const hostname = req.hostname || (req.headers.host?.split(':')[0] as string);
  if (hostname && hostname !== 'localhost' && !hostname.includes('127.0.0.1')) {
    const parts = hostname.split('.');
    if (parts.length >= 3) {
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

async function validateTenantAccess(tenant: any, req: Request): Promise<boolean> {
  if ((req as any).apiKey) {
    if ((req as any).apiKey.tenantId !== tenant.id) {
      throw new ForbiddenError('API key does not have access to this tenant');
    }
    if (!(req as any).apiKey.isActive) {
      throw new UnauthorizedError('API key is inactive');
    }
    return true;
  }
  if (req.user) {
    const hasAccess = await tenantService.userHasAccessToTenant((req.user as any).id, tenant.id);
    if (!hasAccess) {
      throw new ForbiddenError('User does not have access to this tenant');
    }
    return true;
  }
  throw new UnauthorizedError('Authentication required');
}

export const tenantMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const skipTenantPaths = [
      '/api/docs',
      '/api/auth/register',
      '/api/auth/login',
      '/api/system'
    ];
    const shouldSkip = skipTenantPaths.some(path => req.path.startsWith(path));
    if (shouldSkip) return next();
    const tenantInfo = extractTenantIdentifier(req);
    if (!tenantInfo) {
      throw new ValidationError('Tenant identifier required. Provide X-Tenant-ID header, authenticate with JWT, or use subdomain.');
    }
    let tenant;
    if (tenantInfo.type === 'id') {
      tenant = await tenantService.getTenantById(tenantInfo.identifier);
    } else {
      tenant = await tenantService.getTenantBySlug(tenantInfo.identifier);
    }
    if (!tenant) {
      throw new ValidationError(`Tenant not found: ${tenantInfo.identifier}`);
    }
    if (!tenant.isActive) {
      throw new ForbiddenError('Tenant is inactive');
    }
    await validateTenantAccess(tenant, req);
    (req as any).tenant = tenant;
    (req as any).tenantId = tenant.id;
    (req as any).tenantSlug = tenant.slug;
    (req as any).logContext = {
      ...(req as any).logContext,
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      tenantSource: tenantInfo.source
    };
    logger.debug('Tenant context established', {
      requestId: (req as any).id,
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      source: tenantInfo.source,
      identifier: tenantInfo.identifier
    });
    next();
  } catch (error: any) {
    logger.warn('Tenant middleware error', {
      requestId: (req as any).id,
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

export const requireTenantPermission = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!(req as any).tenant) {
        throw new ForbiddenError('Tenant context required');
      }
      const hasPermission = await tenantService.tenantHasPermission((req as any).tenant.id, permission);
      if (!hasPermission) {
        throw new ForbiddenError(`Tenant does not have permission: ${permission}`);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const checkTenantLimits = (resource: string, action: string = 'create') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!(req as any).tenant) {
        throw new ForbiddenError('Tenant context required');
      }
      const hasReachedLimit = await tenantService.checkResourceLimit((req as any).tenant.id, resource, action);
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