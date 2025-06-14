# 🧪 TESTING MANUAL CURSOR → BACKEND → FRONTEND

## 📌 Paso 1: Verificar Backend

### Health Check
```bash
curl http://localhost:3000/health
```

**Esperado**: 
```json
{
  "success": true,
  "status": "healthy",
  "features": {
    "multiTenant": true,
    "cursorIntegration": true,
    "frontendCompatible": true
  }
}
```

---

## 📌 Paso 2: Crear Lead desde CURSOR

### Comando CURL (Simula CURSOR)
```bash
curl -X POST http://localhost:3000/api/agent-actions \
  -H "Authorization: Bearer sk-strato-agent-2025-secure-token-for-cursor-ai-agents" \
  -H "X-Tenant-ID: acme" \
  -H "X-Agent-ID: cursor-prospector-v1" \
  -H "Content-Type: application/json" \
  -d '{
    "actionType": "create_lead",
    "agentId": "cursor-prospector-v1",
    "priority": "high",
    "payload": {
      "leadData": {
        "email": "john@techcorp.com",
        "firstName": "John",
        "lastName": "Doe",
        "company": "Tech Corp",
        "jobTitle": "CEO",
        "source": "cursor-agent",
        "tags": ["high-value",  "tech-ceo"]
      }
    },
    "context": {
      "source": "cursor_agent",
      "correlationId": "test-123"
    }
  }'
```

**Esperado**:
```json
{
  "success": true,
  "action": {
    "id": "...",
    "status": "completed",
    "results": {
      "lead": {
        "id": "...",
        "email": "john@techcorp.com",
        "firstName": "John",
        "lastName": "Doe"
      }
    }
  }
}
```

---

## 📌 Paso 3: Verificar Lead en Backend

### Verificar Lead Creado
```bash
curl http://localhost:3000/api/leads \
  -H "Authorization: Bearer sk-strato-agent-2025-secure-token-for-cursor-ai-agents" \
  -H "X-Tenant-ID: acme"
```

**Esperado**:
```json
{
  "success": true,
  "data": {
    "leads": [
      {
        "id": "...",
        "email": "john@techcorp.com",
        "firstName": "John",
        "lastName": "Doe",
        "company": "Tech Corp",
        "source": "cursor-agent"
      }
    ]
  }
}
```

---

## 📌 Paso 4: Crear Lead para Otro Tenant

### Comando CURL (Tenant diferente)
```bash
curl -X POST http://localhost:3000/api/agent-actions \
  -H "Authorization: Bearer sk-strato-agent-2025-secure-token-for-cursor-ai-agents" \
  -H "X-Tenant-ID: demo" \
  -H "X-Agent-ID: cursor-prospector-v1" \
  -H "Content-Type: application/json" \
  -d '{
    "actionType": "create_lead",
    "agentId": "cursor-prospector-v1",
    "payload": {
      "leadData": {
        "email": "sarah@innovate.com",
        "firstName": "Sarah",
        "lastName": "Johnson",
        "company": "Innovate Inc",
        "source": "cursor-agent"
      }
    }
  }'
```

---

## 📌 Paso 5: Verificar Aislamiento de Datos

### Verificar Leads de Tenant "acme"
```bash
curl http://localhost:3000/api/leads \
  -H "Authorization: Bearer sk-strato-agent-2025-secure-token-for-cursor-ai-agents" \
  -H "X-Tenant-ID: acme"
```

**Esperado**: Solo debe mostrar leads de "acme", no de "demo"

### Verificar Leads de Tenant "demo"
```bash
curl http://localhost:3000/api/leads \
  -H "Authorization: Bearer sk-strato-agent-2025-secure-token-for-cursor-ai-agents" \
  -H "X-Tenant-ID: demo"
```

**Esperado**: Solo debe mostrar leads de "demo", no de "acme"

---

## 📌 Paso 6: Verificar Frontend

### Configurar hosts locales
Añadir a `/etc/hosts`:
```
127.0.0.1 acme.localhost
127.0.0.1 demo.localhost
```

### Iniciar Frontend
```bash
cd frontend
npm run dev
```

### Acceder a Frontend por Tenant
1. Visitar `http://acme.localhost:3001`
2. Iniciar sesión
3. Verificar que solo se muestran leads de "acme"

Luego:
1. Visitar `http://demo.localhost:3001`
2. Iniciar sesión
3. Verificar que solo se muestran leads de "demo"

---

## 📌 Paso 7: Verificar Headers en Frontend

### Inspeccionar Network en DevTools
1. Abrir DevTools (F12)
2. Ir a pestaña Network
3. Recargar página
4. Verificar requests a `/api/leads`

**Headers a verificar**:
- `X-Tenant-ID: acme` (o el tenant correspondiente)
- `Authorization: Bearer ...`

---

## 📌 Paso 8: Verificar Branding por Tenant

### Tenant "acme"
1. Visitar `http://acme.localhost:3001`
2. Verificar colores primarios y logo

### Tenant "demo"
1. Visitar `http://demo.localhost:3001`
2. Verificar colores primarios y logo (deberían ser diferentes)

---

## ✅ Verificación Completa

Si todos los pasos anteriores funcionan correctamente, la integración CURSOR → BACKEND → FRONTEND está funcionando correctamente en modo multi-tenant.

**Flujo verificado**:
1. CURSOR crea leads en backend con contexto de tenant
2. Backend almacena leads con aislamiento por tenant
3. Frontend muestra leads filtrados por tenant
4. Branding y configuración se aplica por tenant