import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/common/logger.js';
import { ValidationError } from '../utils/common/errorHandler.js';

export const sanitizeRequest = (req: Request, res: Response, next: NextFunction): void => {
  try {
    if (req.body && typeof req.body === 'object') {
      req.body = sanitizeObject(req.body);
    }
    if (req.query && typeof req.query === 'object') {
      req.query = sanitizeObject(req.query);
    }
    if (req.params && typeof req.params === 'object') {
      req.params = sanitizeObject(req.params);
    }
    next();
  } catch (error: any) {
    logger.error('Request sanitization failed', {
      error: error.message,
      requestId: req.id
    });
    next(new ValidationError('Invalid request data'));
  }
};

function sanitizeObject(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(item => sanitizeObject(item));
  if (typeof obj === 'object') {
    const sanitized: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      const sanitizedKey = sanitizeString(key);
      sanitized[sanitizedKey] = sanitizeObject(value);
    }
    return sanitized;
  }
  if (typeof obj === 'string') return sanitizeString(obj);
  return obj;
}

function sanitizeString(str: string): string {
  if (typeof str !== 'string') return str;
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/data:text\/html/gi, '')
    .trim();
}

export const validateRequestSize = (maxSize: number = 10 * 1024 * 1024) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const contentLength = parseInt(req.headers['content-length'] as string || '0');
    if (contentLength > maxSize) {
      return next(new ValidationError(`Request too large. Maximum size: ${maxSize} bytes`));
    }
    next();
  };
};

export const validateContentType = (allowedTypes: string[] = ['application/json']) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const contentType = req.headers['content-type'];
    if (req.method === 'GET' || req.method === 'DELETE') return next();
    if (!contentType) return next(new ValidationError('Content-Type header required'));
    const isAllowed = allowedTypes.some(type => contentType.toLowerCase().includes(type.toLowerCase()));
    if (!isAllowed) {
      return next(new ValidationError(`Invalid Content-Type. Allowed: ${allowedTypes.join(', ')}`));
    }
    next();
  };
};

export const validateHeaders = (requiredHeaders: string[] = []) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const missing = requiredHeaders.filter(header => !req.headers[header.toLowerCase()]);
    if (missing.length > 0) {
      return next(new ValidationError(`Missing required headers: ${missing.join(', ')}`));
    }
    next();
  };
};

export const validateRateLimit = (req: Request, res: Response, next: NextFunction): void => {
  const remaining = parseInt(req.headers['x-ratelimit-remaining'] as string || '1000');
  const limit = parseInt(req.headers['x-ratelimit-limit'] as string || '1000');
  if (remaining <= 0) {
    return next(new ValidationError('Rate limit exceeded'));
  }
  res.setHeader('X-RateLimit-Limit', limit);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, remaining - 1));
  res.setHeader('X-RateLimit-Reset', Date.now() + (60 * 1000));
  next();
};

export default {
  sanitizeRequest,
  validateRequestSize,
  validateContentType,
  validateHeaders,
  validateRateLimit
}; 