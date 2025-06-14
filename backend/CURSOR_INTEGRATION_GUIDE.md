# 🤖 GUÍA DE INTEGRACIÓN CURSOR - STRATO AI BACKEND

## 🎯 ENDPOINT PRINCIPAL PARA CURSOR

### **URL Base**
```
http://localhost:3000/api/agent-actions
```

### **Autenticación**
```bash
Authorization: Bearer sk-strato-agent-2025-secure-token-for-cursor-ai-agents
```

### **Headers Requeridos**
```bash
Content-Type: application/json
Authorization: Bearer sk-strato-agent-2025-secure-token-for-cursor-ai-agents
X-Agent-ID: cursor-prospector-v1  # Opcional pero recomendado
```

---

## 🚀 EJEMPLOS DE USO DESDE CURSOR

### **1. Crear Lead**
```javascript
const response = await fetch('http://localhost:3000/api/agent-actions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-strato-agent-2025-secure-token-for-cursor-ai-agents',
    'Content-Type': 'application/json',
    'X-Agent-ID': 'cursor-prospector-v1'
  },
  body: JSON.stringify({
    actionType: 'create_lead',
    agentId: 'cursor-prospector-v1',
    priority: 'high',
    payload: {
      leadData: {
        email: 'prospect@company.com',
        firstName: 'John',
        lastName: 'Doe',
        company: 'Tech Corp',
        jobTitle: 'CEO',
        source: 'ai_agent',
        tags: ['high-value', 'tech-ceo']
      }
    },
    context: {
      source: 'cursor_agent',
      correlationId: 'analysis-session-123'
    }
  })
});

const result = await response.json();
console.log('Lead created:', result);
```

### **2. Analizar Empresa**
```javascript
const response = await fetch('http://localhost:3000/api/agent-actions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-strato-agent-2025-secure-token-for-cursor-ai-agents',
    'Content-Type': 'application/json',
    'X-Agent-ID': 'cursor-analyzer-v1'
  },
  body: JSON.stringify({
    actionType: 'analyze_company',
    agentId: 'cursor-analyzer-v1',
    payload: {
      analysisData: {
        analysisType: 'company',
        parameters: {
          companyName: 'TechCorp Inc',
          website: 'https://techcorp.com'
        }
      }
    }
  })
});
```

### **3. Enviar Email**
```javascript
const response = await fetch('http://localhost:3000/api/agent-actions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-strato-agent-2025-secure-token-for-cursor-ai-agents',
    'Content-Type': 'application/json',
    'X-Agent-ID': 'cursor-emailer-v1'
  },
  body: JSON.stringify({
    actionType: 'send_email',
    agentId: 'cursor-emailer-v1',
    payload: {
      communicationData: {
        type: 'email',
        recipient: 'prospect@company.com',
        subject: 'Partnership Opportunity',
        content: 'Hi John, I noticed your company...',
        template: 'outreach_template_1'
      }
    }
  })
});
```

### **4. Leer Leads Existentes**
```javascript
const response = await fetch('http://localhost:3000/api/leads?status=new&limit=50', {
  headers: {
    'Authorization': 'Bearer sk-strato-agent-2025-secure-token-for-cursor-ai-agents'
  }
});

const leads = await response.json();
console.log('Available leads:', leads.data.leads);
```

---

## 📊 TIPOS DE ACCIONES DISPONIBLES

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

---

## 🔧 CONFIGURACIÓN EN CURSOR

### **Variables de Entorno**
```bash
# En tu proyecto CURSOR, configura:
STRATO_API_URL=http://localhost:3000
STRATO_API_TOKEN=sk-strato-agent-2025-secure-token-for-cursor-ai-agents
STRATO_AGENT_ID=cursor-prospector-v1
```

### **Función Helper para CURSOR**
```javascript
// strato-api.js
class StratoAPI {
  constructor() {
    this.baseUrl = process.env.STRATO_API_URL || 'http://localhost:3000';
    this.token = process.env.STRATO_API_TOKEN;
    this.agentId = process.env.STRATO_AGENT_ID || 'cursor-agent';
  }

  async executeAction(actionType, payload, options = {}) {
    const response = await fetch(`${this.baseUrl}/api/agent-actions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        'X-Agent-ID': this.agentId
      },
      body: JSON.stringify({
        actionType,
        agentId: this.agentId,
        priority: options.priority || 'normal',
        payload,
        context: {
          source: 'cursor_agent',
          correlationId: options.correlationId || `cursor_${Date.now()}`,
          ...options.context
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  async createLead(leadData) {
    return this.executeAction('create_lead', { leadData });
  }

  async analyzeCompany(companyName, website) {
    return this.executeAction('analyze_company', {
      analysisData: {
        analysisType: 'company',
        parameters: { companyName, website }
      }
    });
  }

  async sendEmail(recipient, subject, content) {
    return this.executeAction('send_email', {
      communicationData: {
        type: 'email',
        recipient,
        subject,
        content
      }
    });
  }

  async getLeads(filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${this.baseUrl}/api/leads?${params}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }
}

// Uso en CURSOR
const strato = new StratoAPI();

// Crear lead
await strato.createLead({
  email: 'prospect@company.com',
  firstName: 'John',
  lastName: 'Doe',
  company: 'Tech Corp'
});

// Obtener leads
const leads = await strato.getLeads({ status: 'new', limit: 10 });
```

---

## 📈 MONITOREO Y DEBUGGING

### **Health Check**
```javascript
// Verificar que el backend esté funcionando
const health = await fetch('http://localhost:3000/health');
const status = await health.json();
console.log('Backend status:', status);
```

### **Ver Acciones Ejecutadas**
```javascript
// Ver historial de acciones
const actions = await fetch('http://localhost:3000/api/agent-actions', {
  headers: {
    'Authorization': 'Bearer sk-strato-agent-2025-secure-token-for-cursor-ai-agents'
  }
});

const history = await actions.json();
console.log('Action history:', history.data.actions);
```

### **Logs y Trazabilidad**
- Cada request tiene un `requestId` único
- Los logs incluyen `agentId` para identificar el agente
- Usa `correlationId` para agrupar acciones relacionadas

---

## ⚡ RATE LIMITING

### **Límites para Agentes CURSOR**
- **200 acciones por minuto** por agente
- **Identificación por**: `X-Agent-ID` header
- **Headers de respuesta**: `RateLimit-*` para monitoreo

### **Manejo de Rate Limits**
```javascript
async function executeWithRetry(actionFn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await actionFn();
    } catch (error) {
      if (error.message.includes('429') && i < maxRetries - 1) {
        // Rate limited, wait and retry
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      throw error;
    }
  }
}

// Uso
await executeWithRetry(() => strato.createLead(leadData));
```

---

## 🚨 MANEJO DE ERRORES

### **Códigos de Error Comunes**
- `400` - Datos inválidos
- `401` - Token inválido
- `403` - Sin permisos
- `429` - Rate limit excedido
- `500` - Error interno

### **Estructura de Error**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid lead data",
    "details": {
      "errors": [
        {
          "field": "email",
          "message": "Invalid email format"
        }
      ]
    }
  },
  "timestamp": "2024-12-13T10:30:00Z",
  "requestId": "req_123"
}
```

---

## 🔧 TROUBLESHOOTING

### **Problemas Comunes**

#### **1. Error 401 - Unauthorized**
```bash
# Verificar token
Authorization: Bearer sk-strato-agent-2025-secure-token-for-cursor-ai-agents
```

#### **2. Error 400 - Validation Error**
```javascript
// Verificar estructura de datos
{
  "actionType": "create_lead",  // Requerido
  "agentId": "cursor-agent",    // Requerido
  "payload": {                  // Requerido
    "leadData": {
      "email": "valid@email.com",  // Formato válido
      "firstName": "John",         // Requerido
      "lastName": "Doe"            // Requerido
    }
  }
}
```

#### **3. Error de Conexión**
```bash
# Verificar que el backend esté corriendo
curl http://localhost:3000/health
```

### **Debug Mode**
```javascript
// Habilitar logs detallados
const strato = new StratoAPI();
strato.debug = true;  // Logs detallados en consola
```

---

## 📞 SOPORTE

### **Endpoints de Ayuda**
- **Health**: `GET /health`
- **Documentación**: `GET /api/docs`
- **Métricas**: `GET /api/status/metrics`

### **Información de Debug**
- **Request ID**: En header `X-Request-ID`
- **Correlation ID**: En header `X-Correlation-ID`
- **Rate Limit**: En headers `RateLimit-*`

---

**🎯 ¡El backend está listo para recibir instrucciones de CURSOR!**

**Endpoint Principal**: `POST /api/agent-actions`  
**Token**: `sk-strato-agent-2025-secure-token-for-cursor-ai-agents`  
**Rate Limit**: 200 acciones/minuto