import pino from 'pino';

type LoggerContext = {
  tenant?: string
  repo?: string
  campaignId?: string
}

export const createLogger = (context: LoggerContext = {}) => {
  return pino({
    name: 'strato-agent',
    level: process.env.LOG_LEVEL || 'info',
    transport: {
      target: 'pino-pretty',
      options: { colorize: true, translateTime: 'SYS:standard' },
    },
    base: {
      ...context,
      pid: process.pid,
    },
  });
}

export const logger = createLogger();

/**
 * Crea un logger contextualizado para una ejecución específica (repo, tenant, etc.)
 * @param context - Objeto con tags de contexto (ej: { repo, tenantId })
 */
export function createContextLogger(context: Record<string, any>) {
  return logger.child(context);
} 