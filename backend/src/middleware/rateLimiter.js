/**
 * Rate limiting middleware with multi-tenant support
 */

import { logger } from '../utils/common/logger.js';
import { TooManyRequestsError } from '../utils/common/errorHandler.js';

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map();

/**
 * Rate limiting configuration
 */
const RATE_LIMITS = {
  // General API limits
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // requests per window
    message: 'Too many API requests'
  },
  
  // Authentication limits
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // login attempts per window
    message: 'Too many authentication attempts'
  },
  
  // Agent actions (CURSOR)
  agentActions: {
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 200, // requests per minute for agents
    message: 'Too many agent actions'
  },
  
  // Lead creation
  leadCreation: {
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 50, // leads per minute
    message: 'Too many lead creation requests'
  },
  
  // Campaign operations
  campaigns: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 100, // requests per 5 minutes
    message: 'Too many campaign requests'
  }
};

/**
 * Get rate limit key for request
 */
function getRateLimitKey(req, type) {
  const parts = [type];
  
  // Add tenant ID if available
  if (req.tenantId) {
    parts.push(`tenant:${req.tenantId}`);
  }
  
  // Add user ID for authenticated requests
  if (req.user?.id) {
    parts.push(`user:${req.user.id}`);
  }
  
  // Add API key ID for agent requests
  if (req.apiKey?.id) {
    parts.push(`apikey:${req.apiKey.id}`);
  }
  
  // Add IP address as fallback
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  parts.push(`ip:${ip}`);
  
  return parts.join(':');
}

/**
 * Check rate limit for a key
 */
function checkRateLimit(key, config) {
  const now = Date.now();
  const windowStart = now - config.windowMs;
  
  // Get or create rate limit data
  let rateLimitData = rateLimitStore.get(key);
  if (!rateLimitData) {
    rateLimitData = {
      requests: [],
      resetTime: now + config.windowMs
    };
    rateLimitStore.set(key, rateLimitData);
  }
  
  // Remove old requests outside the window
  rateLimitData.requests = rateLimitData.requests.filter(
    timestamp => timestamp > windowStart
  );
  
  // Check if limit exceeded
  if (rateLimitData.requests.length >= config.max) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: rateLimitData.resetTime,
      total: config.max
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
    total: config.max
  };
}

/**
 * Determine rate limit type based on request
 */
function getRateLimitType(req) {
  const path = req.path;
  const method = req.method;
  
  // Authentication endpoints
  if (path.includes('/auth/')) {
    return 'auth';
  }
  
  // Agent actions (CURSOR)
  if (path.includes('/agent-actions')) {
    return 'agentActions';
  }
  
  // Lead creation
  if (path.includes('/leads') && (method === 'POST' || path.includes('/bulk'))) {
    return 'leadCreation';
  }
  
  // Campaign operations
  if (path.includes('/campaigns')) {
    return 'campaigns';
  }
  
  // Default API limit
  return 'api';
}

/**
 * Main rate limiting middleware
 */
export const rateLimitMiddleware = (req, res, next) => {
  try {
    // Skip rate limiting for health checks
    if (req.path.startsWith('/health')) {
      return next();
    }
    
    const rateLimitType = getRateLimitType(req);
    const config = RATE_LIMITS[rateLimitType];
    const key = getRateLimitKey(req, rateLimitType);
    
    const result = checkRateLimit(key, config);
    
    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', result.total);
    res.setHeader('X-RateLimit-Remaining', result.remaining);
    res.setHeader('X-RateLimit-Reset', Math.ceil(result.resetTime / 1000));
    res.setHeader('X-RateLimit-Type', rateLimitType);
    
    if (!result.allowed) {
      logger.warn('Rate limit exceeded', {
        key,
        type: rateLimitType,
        limit: result.total,
        resetTime: result.resetTime,
        requestId: req.id,
        path: req.path,
        method: req.method,
        userAgent: req.headers['user-agent']
      });
      
      // Set Retry-After header
      const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);
      res.setHeader('Retry-After', retryAfter);
      
      throw new TooManyRequestsError(config.message, {
        retryAfter,
        limit: result.total,
        resetTime: result.resetTime
      });
    }
    
    logger.debug('Rate limit check passed', {
      key,
      type: rateLimitType,
      remaining: result.remaining,
      total: result.total,
      requestId: req.id
    });
    
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Custom rate limiter for specific endpoints
 */
export const customRateLimit = (config) => {
  return (req, res, next) => {
    try {
      const key = getRateLimitKey(req, 'custom');
      const result = checkRateLimit(key, config);
      
      res.setHeader('X-RateLimit-Limit', result.total);
      res.setHeader('X-RateLimit-Remaining', result.remaining);
      res.setHeader('X-RateLimit-Reset', Math.ceil(result.resetTime / 1000));
      
      if (!result.allowed) {
        const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);
        res.setHeader('Retry-After', retryAfter);
        
        throw new TooManyRequestsError(config.message || 'Rate limit exceeded', {
          retryAfter,
          limit: result.total,
          resetTime: result.resetTime
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
export const cleanupRateLimitStore = () => {
  const now = Date.now();
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours
  
  for (const [key, data] of rateLimitStore.entries()) {
    if (now - data.resetTime > maxAge) {
      rateLimitStore.delete(key);
    }
  }
  
  logger.debug('Rate limit store cleanup completed', {
    remainingKeys: rateLimitStore.size
  });
};

// Clean up every hour
setInterval(cleanupRateLimitStore, 60 * 60 * 1000);

export default rateLimitMiddleware;