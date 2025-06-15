import { v4 as uuidv4 } from 'uuid';
import { Request, Response, NextFunction } from 'express';

/**
 * Generate unique request ID for each request
 */
export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  req.id = req.headers['x-request-id'] as string || uuidv4();
  next();
}

/**
 * Handle correlation ID for distributed tracing
 */
export function correlationIdMiddleware(req: Request, res: Response, next: NextFunction) {
  req.correlationId = req.headers['x-correlation-id'] as string || uuidv4();
  next();
}

/**
 * Generate unique ID
 */
export const generateId = (prefix = ''): string => {
  const uuid = uuidv4();
  return prefix ? `${prefix}_${uuid}` : uuid;
};

export default {
  requestIdMiddleware,
  correlationIdMiddleware,
  generateId
}; 