/**
 * Global error handling utilities
 */

import { logger, logError } from './logger.js';

/**
 * Custom error classes
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message, details = null) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 409, 'CONFLICT');
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message = 'Too many requests', details = null) {
    super(message, 429, 'TOO_MANY_REQUESTS', details);
  }
}

export class DatabaseError extends AppError {
  constructor(message = 'Database error', originalError = null) {
    super(message, 500, 'DATABASE_ERROR', originalError);
  }
}

export class ExternalServiceError extends AppError {
  constructor(message = 'External service error', service = null) {
    super(message, 502, 'EXTERNAL_SERVICE_ERROR', { service });
  }
}

/**
 * Global error handler middleware
 */
export const globalErrorHandler = (error, req, res, next) => {
  // Log the error
  logError(error, {
    requestId: req.id,
    correlationId: req.correlationId,
    path: req.path,
    method: req.method,
    userAgent: req.headers['user-agent'],
    ip: req.ip,
    userId: req.user?.id,
    tenantId: req.tenantId,
    agentId: req.agent?.id
  });

  // Handle operational errors
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details
      },
      timestamp: new Date().toISOString(),
      requestId: req.id,
      correlationId: req.correlationId
    });
  }

  // Handle validation errors from libraries
  if (error.name === 'ValidationError' || error.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details: error.errors || error.issues || error.message
      },
      timestamp: new Date().toISOString(),
      requestId: req.id
    });
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid authentication token'
      },
      timestamp: new Date().toISOString(),
      requestId: req.id
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'TOKEN_EXPIRED',
        message: 'Authentication token expired'
      },
      timestamp: new Date().toISOString(),
      requestId: req.id
    });
  }

  // Handle CORS errors
  if (error.message && error.message.includes('CORS')) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'CORS_ERROR',
        message: 'Cross-origin request not allowed'
      },
      timestamp: new Date().toISOString(),
      requestId: req.id
    });
  }

  // Handle Supabase errors
  if (error.code && error.code.startsWith('PGRST')) {
    const statusCode = error.code === 'PGRST116' ? 404 : 500;
    return res.status(statusCode).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: statusCode === 404 ? 'Resource not found' : 'Database operation failed'
      },
      timestamp: new Date().toISOString(),
      requestId: req.id
    });
  }

  // Handle unexpected errors
  logger.error('Unexpected error', {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack
    },
    requestId: req.id,
    path: req.path
  });

  // Don't expose internal errors in production
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : error.message;

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message
    },
    timestamp: new Date().toISOString(),
    requestId: req.id
  });
};

/**
 * Handle unhandled promise rejections
 */
export const handleUnhandledRejection = () => {
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Promise Rejection', {
      reason: reason?.message || reason,
      stack: reason?.stack,
      promise: promise.toString()
    });
    
    // Graceful shutdown
    process.exit(1);
  });
};

/**
 * Handle uncaught exceptions
 */
export const handleUncaughtException = () => {
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      }
    });
    
    // Graceful shutdown
    process.exit(1);
  });
};

/**
 * Async error wrapper for route handlers
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Create error response
 */
export const createErrorResponse = (error, requestId = null) => {
  return {
    success: false,
    error: {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message || 'An error occurred',
      details: error.details || null
    },
    timestamp: new Date().toISOString(),
    requestId
  };
};

export default {
  AppError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  TooManyRequestsError,
  DatabaseError,
  ExternalServiceError,
  globalErrorHandler,
  handleUnhandledRejection,
  handleUncaughtException,
  asyncHandler,
  createErrorResponse
};