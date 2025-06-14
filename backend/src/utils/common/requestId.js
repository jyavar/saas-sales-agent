/**
 * Request ID and correlation ID middleware
 */

import { randomUUID } from 'crypto';

/**
 * Generate unique request ID for each request
 */
export const requestIdMiddleware = (req, res, next) => {
  // Use existing request ID from header or generate new one
  req.id = req.headers['x-request-id'] || `req_${randomUUID()}`;
  
  // Set response header
  res.setHeader('X-Request-ID', req.id);
  
  // Initialize log context
  req.logContext = {
    requestId: req.id,
    method: req.method,
    path: req.path,
    userAgent: req.headers['user-agent'],
    ip: req.ip || req.connection.remoteAddress
  };
  
  next();
};

/**
 * Handle correlation ID for distributed tracing
 */
export const correlationIdMiddleware = (req, res, next) => {
  // Use existing correlation ID from header or generate new one
  req.correlationId = req.headers['x-correlation-id'] || req.id;
  
  // Set response header
  res.setHeader('X-Correlation-ID', req.correlationId);
  
  // Add to log context
  req.logContext.correlationId = req.correlationId;
  
  next();
};

/**
 * Generate unique ID
 */
export const generateId = (prefix = '') => {
  const uuid = randomUUID();
  return prefix ? `${prefix}_${uuid}` : uuid;
};

export default {
  requestIdMiddleware,
  correlationIdMiddleware,
  generateId
};