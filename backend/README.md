# 🤖 Strato AI Sales Agent Backend

**Backend API completo para la plataforma de generación de leads asistida por IA**

Diseñado para servir datos al frontend Next.js y procesar peticiones de agentes autónomos desde CURSOR.

## 🎯 **Características Principales**

### ✅ **API REST Estándar Documentada**
- `GET /api/leads` → Listar todos los leads con filtros y paginación
- `POST /api/leads` → Crear nuevos leads (usado por agente IA)
- `POST /api/agent-actions` → **Endpoint principal para agentes CURSOR**
- `GET /api/status/health` → Health check automatizado

### ✅ **Autenticación Dual**
- **JWT Tokens** para usuarios frontend
- **API Keys** para agentes automatizados (CURSOR)

### ✅ **Seguridad Multicapa**
- Headers de seguridad con Helmet
- CORS configurado para orígenes específicos
- Rate limiting inteligente por tipo de operación
- Validación de entrada con Zod

### ✅ **Observabilidad Completa**
- Logging estructurado con request IDs
- Trazabilidad completa de operaciones
- Health checks detallados
- Métricas de performance

## 🚀 **Configuración Rápida**

### 1. **Variables de Entorno**
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

### 2. **Instalar Dependencias**
```bash
npm install
```

### 3. **Iniciar Servidor**
```bash
npm run dev
```

## 🔑 **CURSOR Agent API**

### **Autenticación**
```bash
Authorization: Bearer {AGENT_SECRET_TOKEN}
# O alternativamente:
X-API-Key: {AGENT_SECRET_TOKEN}
```

### **Crear Lead desde CURSOR**
```javascript
POST /api/agent-actions
Content-Type: application/json
Authorization: Bearer your_agent_secret_token

{
  "actionType": "create_lead",
  "agentId": "cursor-prospector-v1",
  "priority": "high",
  "payload": {
    "leadData": {
      "email": "prospect@company.com",
      "firstName": "John",
      "lastName": "Doe",
      "company": "Tech Corp",
      "jobTitle": "CEO",
      "source": "ai_agent",
      "tags": ["high-value", "tech-ceo"]
    }
  },
  "context": {
    "source": "cursor_agent",
    "correlationId": "analysis-session-123"
  }
}
```

### **Leer Leads**
```javascript
GET /api/leads?status=new&limit=50
Authorization: Bearer your_agent_secret_token
```

### **Analizar Empresa**
```javascript
POST /api/agent-actions
{
  "actionType": "analyze_company",
  "agentId": "cursor-analyzer-v1",
  "payload": {
    "analysisData": {
      "analysisType": "company",
      "parameters": {
        "companyName": "TechCorp Inc",
        "website": "https://techcorp.com"
      }
    }
  }
}
```

## 📊 **Endpoints Disponibles**

### **Leads Management**
- `GET /api/leads` - Listar leads con filtros
- `POST /api/leads` - Crear nuevo lead
- `GET /api/leads/:id` - Obtener lead específico
- `PUT /api/leads/:id` - Actualizar lead
- `DELETE /api/leads/:id` - Eliminar lead
- `POST /api/leads/bulk` - Operaciones masivas
- `GET /api/leads/stats` - Estadísticas de leads

### **Agent Actions**
- `POST /api/agent-actions` - **Endpoint principal para CURSOR**
- `GET /api/agent-actions` - Listar acciones de agentes
- `GET /api/agent-actions/:id` - Obtener acción específica
- `PUT /api/agent-actions/:id` - Actualizar estado de acción
- `GET /api/agent-actions/stats` - Estadísticas de agentes

### **System Health**
- `GET /health` - Health check básico
- `GET /api/status/health` - Health check detallado
- `GET /api/status/ready` - Readiness probe
- `GET /api/status/live` - Liveness probe
- `GET /api/status/metrics` - Métricas del sistema

### **Analytics**
- `GET /api/analytics/dashboard` - Dashboard analytics
- `GET /api/admin/config` - Configuración del sistema (admin)
- `POST /api/admin/cache/clear` - Limpiar cachés (admin)

## 🔧 **Tipos de Acciones Soportadas**

### **Gestión de Leads**
- `create_lead` - Crear nuevo lead
- `update_lead` - Actualizar lead existente
- `qualify_lead` - Calificar lead
- `score_lead` - Asignar puntuación

### **Comunicación**
- `send_email` - Enviar email
- `schedule_call` - Programar llamada
- `send_message` - Enviar mensaje

### **Análisis**
- `analyze_company` - Analizar empresa
- `research_contact` - Investigar contacto
- `sentiment_analysis` - Análisis de sentimiento

### **Workflows**
- `trigger_workflow` - Activar workflow
- `update_pipeline` - Actualizar pipeline
- `create_task` - Crear tarea

### **Sistema**
- `health_check` - Verificar salud del sistema
- `log_event` - Registrar evento

## 🛡️ **Seguridad Implementada**

### **Rate Limiting**
- **Agentes IA**: 200 acciones/minuto
- **API General**: 100 requests/minuto
- **Operaciones de escritura**: 50/minuto
- **Operaciones masivas**: 10/5 minutos

### **Validación de Entrada**
- Todos los endpoints usan validación Zod
- Sanitización automática XSS
- Validación de tipos y formatos

### **CORS Configurado**
- `http://localhost:3000` (dev frontend)
- `https://strato.salesagent.ai` (prod frontend)
- `https://*.cursor.sh` (agentes CURSOR)

## 📈 **Performance y Caché**

### **Sistema de Caché Redis-Compatible**
- Sesiones de usuario: 1 hora
- Datos de usuario: 15 minutos
- Respuestas API: 5 minutos
- LRU eviction automática

### **Optimizaciones**
- Connection pooling a Supabase
- Índices optimizados en base de datos
- Compresión de respuestas
- Logging estructurado

## 🔍 **Monitoreo y Observabilidad**

### **Logging Estructurado**
- Formato JSON en producción
- Request IDs para trazabilidad
- Correlation IDs para seguimiento
- Múltiples niveles de log

### **Health Checks**
- Conectividad a base de datos
- Estado de servicios externos
- Uso de memoria y CPU
- Verificaciones periódicas

### **Métricas**
- Tiempo de respuesta
- Tasa de errores
- Throughput
- Performance de caché

## 🚀 **Deployment**

### **Variables Requeridas**
```bash
AGENT_SECRET_TOKEN=your_secure_token
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
JWT_SECRET=your_32_char_secret
```

### **Scripts Disponibles**
```bash
npm run dev          # Desarrollo
npm start           # Producción
npm test            # Tests
npm run lint        # Linting
npm run format      # Formateo
```

## 🧪 **Testing**

### **Probar desde CURL**
```bash
# Health check
curl http://localhost:3000/health

# Crear lead
curl -X POST http://localhost:3000/api/agent-actions \
  -H "Authorization: Bearer your_agent_secret_token" \
  -H "Content-Type: application/json" \
  -d '{
    "actionType": "create_lead",
    "agentId": "cursor-test",
    "payload": {
      "leadData": {
        "email": "test@example.com",
        "firstName": "Test",
        "lastName": "User",
        "company": "Test Corp"
      }
    }
  }'

# Listar leads
curl http://localhost:3000/api/leads \
  -H "Authorization: Bearer your_agent_secret_token"
```

## 📚 **Documentación API**

Una vez iniciado el servidor, la documentación interactiva estará disponible en:
- **Swagger UI**: `http://localhost:3000/api/docs`
- **OpenAPI Spec**: `http://localhost:3000/api/docs/openapi.json`

## 🤝 **Integración con Frontend**

### **Next.js Frontend**
```javascript
// Ejemplo de uso desde Next.js
const response = await fetch('/api/leads', {
  headers: {
    'Authorization': `Bearer ${userToken}`,
    'Content-Type': 'application/json'
  }
});
```

### **CURSOR Agent**
```javascript
// Ejemplo de uso desde CURSOR
const response = await fetch('http://localhost:3000/api/agent-actions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.AGENT_SECRET_TOKEN}`,
    'Content-Type': 'application/json',
    'X-Agent-ID': 'cursor-agent-v1'
  },
  body: JSON.stringify({
    actionType: 'create_lead',
    agentId: 'cursor-agent-v1',
    payload: { leadData: leadInfo }
  })
});
```

## 🔧 **Configuración Avanzada**

### **Rate Limiting Personalizado**
```javascript
// En .env
RATE_LIMIT_AGENT_MAX=500  # Más requests para agentes
RATE_LIMIT_WINDOW_MS=60000  # Ventana de 1 minuto
```

### **Caché Personalizado**
```javascript
// TTL personalizado por tipo de dato
CACHE_TTL_SESSIONS=7200000  # 2 horas
CACHE_TTL_USER_DATA=1800000  # 30 minutos
```

## 🆘 **Troubleshooting**

### **Problemas Comunes**

1. **Error de autenticación**
   - Verificar `AGENT_SECRET_TOKEN` en .env
   - Asegurar que el header Authorization esté correcto

2. **CORS Error**
   - Verificar `ALLOWED_ORIGINS` en .env
   - Añadir el dominio de tu frontend

3. **Base de datos no conecta**
   - Verificar credenciales de Supabase
   - Comprobar que las migraciones se ejecutaron

### **Logs de Debug**
```bash
LOG_LEVEL=debug npm run dev
```

## 📞 **Soporte**

- **Documentación**: `/api/docs`
- **Health Check**: `/health`
- **Métricas**: `/api/status/metrics`

---

## 🚀 Flujo E2E: UI → Backend → Agent → UI

1. **Desde la UI**: Ve a `/dashboard/campaigns`, haz clic en "New Campaign", completa el formulario y envía.
2. **Backend**: El endpoint `/api/campaigns` persiste la campaña y llama al agente (`runAgentForCampaign`).
3. **Agente**: Analiza el repo, genera la campaña y devuelve el resultado.
4. **Respuesta**: El frontend muestra un toast y el resultado del agente.

### Ejemplo de request
```json
POST /api/campaigns
{
  "name": "Growth Hack",
  "repoUrl": "https://github.com/org/repo",
  "tenantId": "tenant-uuid"
}
```

### Ejemplo de respuesta
```json
{
  "campaign": { "id": "...", "name": "Growth Hack", ... },
  "agentResult": {
    "success": true,
    "campaignId": "...",
    "analysis": { ... },
    "generated": { ... }
  }
}
```

---

**🎯 El backend está 100% listo para conectar con tu frontend Next.js y recibir instrucciones de agentes CURSOR.**

**Última actualización**: Diciembre 2024  
**Versión**: 1.0.0  
**Estado**: ✅ Production Ready

## Descripción
API REST, validación Zod, persistencia (Supabase), email productivo (Resend), endpoints para campañas y actividades.

## Estructura
- `src/` - Código fuente principal.
- `models/` - Esquemas Zod centralizados.
- `controllers/` - Lógica de endpoints.
- `services/` - Integraciones externas.

## Variables de entorno
Ver [docs/ENV.md](./docs/ENV.md).

## Pipeline de campaña
Ver [docs/AGENT_PIPELINE.md](./docs/AGENT_PIPELINE.md).

## Tests
Ejecuta:
```sh
pnpm vitest run backend
```

## 🚀 Quickstart

### 1. Instalar dependencias
```sh
pnpm install
```

### 2. Variables de entorno
Copia `.env.example` a `.env` y completa los valores:
```sh
cp backend/.env.example backend/.env
```

### 3. Correr en desarrollo
```sh
pnpm --filter backend dev
```

### 4. Correr en producción
```sh
pnpm --filter backend build && pnpm --filter backend start
```

### 5. Ejecutar tests
```sh
pnpm --filter backend vitest run --coverage
```

### 6. Despliegue (Railway/Vercel)
- Configura variables de entorno en el dashboard de Railway/Vercel.
- El workflow de GitHub Actions despliega automáticamente a staging y producción.

### 7. CI/CD y Rollback
- El pipeline ejecuta: lint → build → deploy staging → smoke test → deploy prod.
- Si el healthcheck falla, el deploy se cancela y puedes ejecutar rollback manual con:
```sh
node scripts/rollback.js production
```

### 8. Variables de entorno
Consulta `.env.example` y la sección de [Variables de Entorno](#variables-de-entorno) para detalles de cada variable.

### 9. Documentación y Swagger
- Accede a la documentación OpenAPI en `/api/docs/openapi.json`.
- Actualiza el spec editando los controladores y rutas.

### 10. Restauración y Backups
- Supabase realiza backups automáticos.
- Para restaurar, sigue la guía en `DEPLOYMENT.md` y usa los scripts de `supabase/migrations/`.

---

## Variables de Entorno

| Variable                | Descripción                                 |
|-------------------------|---------------------------------------------|
| SUPABASE_URL            | URL de tu proyecto Supabase                 |
| SUPABASE_ANON_KEY       | Clave anónima de Supabase                   |
| SUPABASE_SERVICE_ROLE_KEY | Clave de rol de servicio Supabase         |
| STRIPE_SECRET_KEY       | Clave secreta de Stripe                     |
| STRIPE_WEBHOOK_SECRET   | Webhook secret de Stripe                    |
| STRIPE_PUBLISHABLE_KEY  | Clave pública de Stripe                     |
| RESEND_API_KEY          | API key de Resend                           |
| RESEND_WEBHOOK_SECRET   | Webhook secret de Resend                    |
| GITHUB_TOKEN            | Token de GitHub para análisis de repos      |
| GITHUB_WEBHOOK_SECRET   | Webhook secret de GitHub                    |
| OPENAI_API_KEY          | API key de OpenAI                           |
| OPENAI_ORG_ID           | ID de organización de OpenAI                |
| JWT_SECRET              | Secreto JWT para autenticación              |
| JWT_EXPIRES_IN          | Expiración del JWT (ej: 7d)                 |
| PORT                    | Puerto del servidor                         |
| NODE_ENV                | Entorno (development/production)            |
| LOG_LEVEL               | Nivel de logs                               |
| ALLOWED_ORIGINS         | Orígenes permitidos para CORS               |
| SENTRY_DSN              | DSN de Sentry para monitoreo                |
| ENABLE_METRICS          | Habilitar métricas                          |

---

## Despliegue y restauración
Consulta `DEPLOYMENT.md` para detalles avanzados de despliegue, backups y restauración.