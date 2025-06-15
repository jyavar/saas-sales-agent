/**
 * Request ID and correlation ID middleware
 */

import { v4 as uuidv4 } from 'uuid';

/**
 * Generate unique request ID for each request
 */
export function requestIdMiddleware(req, res, next) {
  req.id = req.headers['x-request-id'] || uuidv4();
  next();
}

/**
 * Handle correlation ID for distributed tracing
 */
export function correlationIdMiddleware(req, res, next) {
  req.correlationId = req.headers['x-correlation-id'] || uuidv4();
  next();
}

/**
 * Generate unique ID
 */
export const generateId = (prefix = '') => {
  const uuid = uuidv4();
  return prefix ? `${prefix}_${uuid}` : uuid;
};

export default {
  requestIdMiddleware,
  correlationIdMiddleware,
  generateId
};