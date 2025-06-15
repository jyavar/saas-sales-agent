import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/common/logger.js';
import { TooManyRequestsError } from '../utils/common/errorHandler.js';

/**
 * Rate limiting configuration interface
 */
export interface RateLimitConfig {
  windowMs: number;
  max: number;
  message?: string;
}

/**
 * Rate limit result interface
 */
interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  total: number;
}

/**
 * Rate limit store data interface
 */
interface RateLimitData {
  requests: number[];
  resetTime: number;
}

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, RateLimitData>();

/**
 * Rate limiting configuration
 */
export const RATE_LIMITS: Record<string, RateLimitConfig> = {
  api: {
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: 'Too many API requests',
  },
  auth: {
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many authentication attempts',
  },
  agentActions: {
    windowMs: 1 * 60 * 1000,
    max: 200,
    message: 'Too many agent actions',
  },
  leadCreation: {
    windowMs: 1 * 60 * 1000,
    max: 50,
    message: 'Too many lead creation requests',
  },
  campaigns: {
    windowMs: 5 * 60 * 1000,
    max: 100,
    message: 'Too many campaign requests',
  },
};

/**
 * Get rate limit key for request
 */
function getRateLimitKey(req: Request, type: string): string {
  const parts: string[] = [type];
  // Add tenant ID if available
  if ((req as any).tenantId) {
    parts.push(`tenant:${(req as any).tenantId}`);
  }
  // Add user ID for authenticated requests
  if ((req as any).user?.id) {
    parts.push(`user:${(req as any).user.id}`);
  }
  // Add API key ID for agent requests
  if ((req as any).apiKey?.id) {
    parts.push(`apikey:${(req as any).apiKey.id}`);
  }
  // Add IP address as fallback
  const ip = req.ip || (req.connection as any)?.remoteAddress || 'unknown';
  parts.push(`ip:${ip}`);
  return parts.join(':');
}

/**
 * Check rate limit for a key
 */
function checkRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  const windowStart = now - config.windowMs;
  let rateLimitData = rateLimitStore.get(key);
  if (!rateLimitData) {
    rateLimitData = {
      requests: [],
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(key, rateLimitData);
  }
  // Remove old requests outside the window
  rateLimitData.requests = rateLimitData.requests.filter(
    (timestamp) => timestamp > windowStart
  );
  // Check if limit exceeded
  if (rateLimitData.requests.length >= config.max) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: rateLimitData.resetTime,
      total: config.max,
    };
  }
  // Add current request
  rateLimitData.requests.push(now);
  // Update reset time if needed
  if (now > rateLimitData.resetTime) {
    rateLimitData.resetTime = now + config.windowMs;
  }
  return {
    allowed: true,
    remaining: config.max - rateLimitData.requests.length,
    resetTime: rateLimitData.resetTime,
    total: config.max,
  };
}

/**
 * Determine rate limit type based on request
 */
function getRateLimitType(req: Request): keyof typeof RATE_LIMITS {
  const path = req.path;
  const method = req.method;
  if (path.includes('/auth/')) return 'auth';
  if (path.includes('/agent-actions')) return 'agentActions';
  if (path.includes('/leads') && (method === 'POST' || path.includes('/bulk'))) return 'leadCreation';
  if (path.includes('/campaigns')) return 'campaigns';
  return 'api';
}

/**
 * Rate limiting middleware for all endpoints
 * @remarks Sets X-RateLimit headers and throws TooManyRequestsError if exceeded
 */
export const rateLimitMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    if (req.path.startsWith('/health')) return next();
    const rateLimitType = getRateLimitType(req);
    const config = RATE_LIMITS[rateLimitType];
    const key = getRateLimitKey(req, rateLimitType);
    const result = checkRateLimit(key, config);
    res.setHeader('X-RateLimit-Limit', result.total.toString());
    res.setHeader('X-RateLimit-Remaining', result.remaining.toString());
    res.setHeader('X-RateLimit-Reset', Math.ceil(result.resetTime / 1000).toString());
    res.setHeader('X-RateLimit-Type', rateLimitType);
    if (!result.allowed) {
      logger.warn('Rate limit exceeded', {
        key,
        type: rateLimitType,
        limit: result.total,
        resetTime: result.resetTime,
        requestId: (req as any).id,
        path: req.path,
        method: req.method,
        userAgent: req.headers['user-agent'],
      });
      const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);
      res.setHeader('Retry-After', retryAfter.toString());
      throw new TooManyRequestsError(config.message || 'Rate limit exceeded', {
        retryAfter,
        limit: result.total,
        resetTime: result.resetTime,
      });
    }
    logger.debug('Rate limit check passed', {
      key,
      type: rateLimitType,
      remaining: result.remaining,
      total: result.total,
      requestId: (req as any).id,
    });
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Custom rate limiter for specific endpoints
 * @param config Custom rate limit configuration
 */
export const customRateLimit = (config: RateLimitConfig) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const key = getRateLimitKey(req, 'custom');
      const result = checkRateLimit(key, config);
      res.setHeader('X-RateLimit-Limit', result.total.toString());
      res.setHeader('X-RateLimit-Remaining', result.remaining.toString());
      res.setHeader('X-RateLimit-Reset', Math.ceil(result.resetTime / 1000).toString());
      if (!result.allowed) {
        const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);
        res.setHeader('Retry-After', retryAfter.toString());
        throw new TooManyRequestsError(config.message || 'Rate limit exceeded', {
          retryAfter,
          limit: result.total,
          resetTime: result.resetTime,
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Clean up old rate limit data (call periodically)
 */
export const cleanupRateLimitStore = (): void => {
  const now = Date.now();
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours
  for (const [key, data] of rateLimitStore.entries()) {
    if (now - data.resetTime > maxAge) {
      rateLimitStore.delete(key);
    }
  }
  logger.debug('Rate limit store cleanup completed', {
    remainingKeys: rateLimitStore.size,
  });
};

// Clean up every hour
setInterval(cleanupRateLimitStore, 60 * 60 * 1000);

export default rateLimitMiddleware; 