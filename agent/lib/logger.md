# Logger Module (agent/lib/logger.ts)

Este módulo provee una instancia de logger estructurado usando **Pino**, optimizado para agentes CLI o servicios Node.js.

## Características

- Logging estructurado con Pino
- Salida bonita en consola por defecto (`pino-pretty`)
- Contexto por ejecución (`tenant`, `repo`, `campaignId`, etc.)
- Preparado para logging remoto (DataDog, Logtail, Sentry, etc.)
- Reutilizable como módulo en cualquier proyecto

## Instalación

Asegúrate de tener instalado:
```bash
pnpm add pino pino-pretty
```

## Uso básico

```ts
import { logger } from './lib/logger'

logger.info('Inicio del agente')
logger.error({ repo: 'github.com/ejemplo/repo' }, 'Error analizando repo')
```

## Logger contextual

```ts
import { createLogger } from './lib/logger'

const repoLogger = createLogger({ repo: 'github.com/foo/bar', tenant: 'acme' })
repoLogger.info('Procesando campaña personalizada')
```

## Futuras extensiones
- Logs a archivo `.log`
- Exportar a servicios de monitoreo
- Inyectar logger global en agente o middleware 