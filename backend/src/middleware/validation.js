/**
 * Input validation and sanitization middleware
 */

import { logger } from '../utils/common/logger.js';
import { ValidationError } from '../utils/common/errorHandler.ts';

/**
 * Sanitize request data to prevent XSS attacks
 */
export const sanitizeRequest = (req, res, next) => {
  try {
    // Sanitize body
    if (req.body && typeof req.body === 'object') {
      req.body = sanitizeObject(req.body);
    }

    // Sanitize query parameters
    if (req.query && typeof req.query === 'object') {
      req.query = sanitizeObject(req.query);
    }

    // Sanitize URL parameters
    if (req.params && typeof req.params === 'object') {
      req.params = sanitizeObject(req.params);
    }

    next();
  } catch (error) {
    logger.error('Request sanitization failed', {
      error: error.message,
      requestId: req.id
    });
    next(new ValidationError('Invalid request data'));
  }
};

/**
 * Sanitize an object recursively
 */
function sanitizeObject(obj) {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  if (typeof obj === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      const sanitizedKey = sanitizeString(key);
      sanitized[sanitizedKey] = sanitizeObject(value);
    }
    return sanitized;
  }

  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }

  return obj;
}

/**
 * Sanitize a string to prevent XSS
 */
function sanitizeString(str) {
  if (typeof str !== 'string') {
    return str;
  }

  // Remove script tags and event handlers
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/data:text\/html/gi, '')
    .trim();
}

/**
 * Validate request size
 */
export const validateRequestSize = (maxSize = 10 * 1024 * 1024) => { // 10MB default
  return (req, res, next) => {
    const contentLength = parseInt(req.headers['content-length'] || '0');
    
    if (contentLength > maxSize) {
      return next(new ValidationError(`Request too large. Maximum size: ${maxSize} bytes`));
    }
    
    next();
  };
};

/**
 * Validate content type
 */
export const validateContentType = (allowedTypes = ['application/json']) => {
  return (req, res, next) => {
    const contentType = req.headers['content-type'];
    
    if (req.method === 'GET' || req.method === 'DELETE') {
      return next(); // No body expected
    }
    
    if (!contentType) {
      return next(new ValidationError('Content-Type header required'));
    }
    
    const isAllowed = allowedTypes.some(type => 
      contentType.toLowerCase().includes(type.toLowerCase())
    );
    
    if (!isAllowed) {
      return next(new ValidationError(`Invalid Content-Type. Allowed: ${allowedTypes.join(', ')}`));
    }
    
    next();
  };
};

/**
 * Validate required headers
 */
export const validateHeaders = (requiredHeaders = []) => {
  return (req, res, next) => {
    const missing = requiredHeaders.filter(header => 
      !req.headers[header.toLowerCase()]
    );
    
    if (missing.length > 0) {
      return next(new ValidationError(`Missing required headers: ${missing.join(', ')}`));
    }
    
    next();
  };
};

/**
 * Rate limiting validation
 */
export const validateRateLimit = (req, res, next) => {
  // Check if rate limit headers are present
  const remaining = parseInt(req.headers['x-ratelimit-remaining'] || '1000');
  const limit = parseInt(req.headers['x-ratelimit-limit'] || '1000');
  
  if (remaining <= 0) {
    return next(new ValidationError('Rate limit exceeded'));
  }
  
  // Add rate limit info to response headers
  res.setHeader('X-RateLimit-Limit', limit);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, remaining - 1));
  res.setHeader('X-RateLimit-Reset', Date.now() + (60 * 1000)); // Reset in 1 minute
  
  next();
};

export default {
  sanitizeRequest,
  validateRequestSize,
  validateContentType,
  validateHeaders,
  validateRateLimit
};