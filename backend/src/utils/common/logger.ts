import * as Sentry from '@sentry/node';
import { Request, Response, NextFunction } from 'express';

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

type LogLevel = keyof typeof LOG_LEVELS;

const currentLogLevel = LOG_LEVELS[process.env.LOG_LEVEL as LogLevel] || LOG_LEVELS.info;

if (process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN });
}

function formatLogMessage(level: LogLevel, message: string, data: Record<string, any> = {}): string {
  const timestamp = new Date().toISOString();
  if (process.env.NODE_ENV === 'production') {
    return JSON.stringify({
      timestamp,
      level: level.toUpperCase(),
      message,
      ...data
    });
  } else {
    const dataStr = Object.keys(data).length > 0 ? ` ${JSON.stringify(data, null, 2)}` : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${dataStr}`;
  }
}

function log(level: LogLevel, message: string, data: Record<string, any> = {}): void {
  if (LOG_LEVELS[level] > currentLogLevel) return;
  const formattedMessage = formatLogMessage(level, message, data);
  if (level === 'error') {
    if (process.env.SENTRY_DSN) {
      Sentry.captureException(data?.error || message);
    }
    console.error(formattedMessage);
  } else if (level === 'warn') {
    console.warn(formattedMessage);
  } else {
    console.log(formattedMessage);
  }
}

export const logger = {
  error: (message: string, data?: Record<string, any>) => log('error', message, data),
  warn: (message: string, data?: Record<string, any>) => log('warn', message, data),
  info: (message: string, data?: Record<string, any>) => log('info', message, data),
  debug: (message: string, data?: Record<string, any>) => log('debug', message, data)
};

export const logRequest = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  logger.info('Incoming request', {
    requestId: req.id,
    method: req.method,
    path: req.path,
    query: req.query,
    userAgent: req.headers['user-agent'],
    ip: req.ip || (req.connection as any)?.remoteAddress,
    tenantId: (req.headers['x-tenant-id'] as string) || undefined,
    agentId: (req.headers['x-agent-id'] as string) || undefined
  });
  const originalEnd = res.end;
  res.end = function(chunk?: any, encoding?: any) {
    const duration = Date.now() - start;
    logger.info('Request completed', {
      requestId: req.id,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.getHeader('content-length'),
      tenantId: (req as any).tenantId,
      userId: req.user?.id,
      agentId: req.agent?.id
    });
    return originalEnd.call(this, chunk, encoding);
  };
  next();
};

export const logError = (error: any, context: Record<string, any> = {}): void => {
  logger.error('Error occurred', {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: error.code
    },
    ...context
  });
};

export const logPerformance = (operation: string, duration: number, context: Record<string, any> = {}): void => {
  const level: LogLevel = duration > 1000 ? 'warn' : 'debug';
  logger[level]('Performance metric', {
    operation,
    duration: `${duration}ms`,
    slow: duration > 1000,
    ...context
  });
};

export const logSecurityEvent = (event: string, details: Record<string, any> = {}): void => {
  logger.warn('Security event', {
    event,
    timestamp: new Date().toISOString(),
    ...details
  });
};

export default logger; 