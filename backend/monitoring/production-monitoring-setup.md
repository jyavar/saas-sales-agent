# 📊 CONFIGURACIÓN DE MONITOREO EN PRODUCCIÓN - STRATO AI

## 🎯 STACK DE OBSERVABILIDAD RECOMENDADO

### Opción 1: Stack Completo (Recomendado)
- **Métricas**: Prometheus + Grafana
- **Logs**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Trazas**: Jaeger o Zipkin
- **Alertas**: AlertManager + PagerDuty
- **Uptime**: Pingdom o UptimeRobot
- **APM**: Sentry (ya implementado)

### Opción 2: Stack Simplificado
- **Todo-en-uno**: Datadog o New Relic
- **Logs**: Datadog Logs o New Relic Logs
- **Alertas**: Integradas en la plataforma
- **Uptime**: Integrado

### Opción 3: Stack Económico
- **Métricas**: Grafana Cloud (Free tier)
- **Logs**: Grafana Loki
- **Alertas**: Grafana Alerting
- **Uptime**: UptimeRobot (Free)
- **APM**: Sentry (ya implementado)

---

## 🔧 CONFIGURACIÓN PROMETHEUS + GRAFANA

### 1. Prometheus Configuration
```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alert_rules.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093

scrape_configs:
  - job_name: 'stratoai-backend'
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: '/api/optimization/metrics'
    scrape_interval: 30s
    
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['localhost:9100']
      
  - job_name: 'postgres-exporter'
    static_configs:
      - targets: ['localhost:9187']
```

### 2. Alert Rules
```yaml
# alert_rules.yml
groups:
  - name: stratoai-backend
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} for the last 5 minutes"
          
      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High response time detected"
          description: "95th percentile response time is {{ $value }}s"
          
      - alert: CircuitBreakerOpen
        expr: circuit_breaker_state{state="open"} == 1
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Circuit breaker is open"
          description: "Circuit breaker for {{ $labels.service }} is open"
          
      - alert: HighMemoryUsage
        expr: process_resident_memory_bytes / 1024 / 1024 > 512
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage"
          description: "Memory usage is {{ $value }}MB"
          
      - alert: DatabaseConnectionFailure
        expr: up{job="postgres-exporter"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Database connection failure"
          description: "Cannot connect to PostgreSQL database"
```

### 3. Grafana Dashboard JSON
```json
{
  "dashboard": {
    "id": null,
    "title": "StratoAI Backend Monitoring",
    "tags": ["stratoai", "backend", "nodejs"],
    "timezone": "browser",
    "panels": [
      {
        "id": 1,
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{route}}"
          }
        ],
        "yAxes": [
          {
            "label": "Requests/sec"
          }
        ]
      },
      {
        "id": 2,
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          },
          {
            "expr": "histogram_quantile(0.50, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "50th percentile"
          }
        ]
      },
      {
        "id": 3,
        "title": "Error Rate",
        "type": "singlestat",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5..\"}[5m]) / rate(http_requests_total[5m])",
            "legendFormat": "Error Rate"
          }
        ],
        "thresholds": "0.01,0.05"
      },
      {
        "id": 4,
        "title": "Circuit Breaker Status",
        "type": "table",
        "targets": [
          {
            "expr": "circuit_breaker_state",
            "format": "table"
          }
        ]
      },
      {
        "id": 5,
        "title": "Cache Hit Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "cache_hit_rate",
            "legendFormat": "{{cache_name}}"
          }
        ]
      },
      {
        "id": 6,
        "title": "Database Performance",
        "type": "graph",
        "targets": [
          {
            "expr": "database_query_duration_seconds",
            "legendFormat": "Query Duration"
          }
        ]
      }
    ],
    "time": {
      "from": "now-1h",
      "to": "now"
    },
    "refresh": "30s"
  }
}
```

---

## 📊 CONFIGURACIÓN DATADOG (Alternativa)

### 1. Datadog Agent Configuration
```yaml
# datadog.yaml
api_key: YOUR_DATADOG_API_KEY
site: datadoghq.com

logs_enabled: true
process_config:
  enabled: true

apm_config:
  enabled: true
  env: production

integrations:
  nodejs:
    init_config:
    instances:
      - host: localhost
        port: 3000
        
  postgres:
    init_config:
    instances:
      - host: localhost
        port: 5432
        username: datadog
        password: YOUR_PASSWORD
        dbname: stratoai
```

### 2. Custom Metrics
```javascript
// src/utils/monitoring/datadog.js
import { StatsD } from 'node-statsd';

const statsd = new StatsD({
  host: 'localhost',
  port: 8125,
  prefix: 'stratoai.backend.'
});

export function trackMetric(name, value, tags = []) {
  statsd.gauge(name, value, tags);
}

export function incrementCounter(name, tags = []) {
  statsd.increment(name, 1, tags);
}

export function trackTiming(name, duration, tags = []) {
  statsd.timing(name, duration, tags);
}

// Usage in application
trackMetric('campaigns.created', 1, ['tenant:123']);
incrementCounter('api.requests', ['endpoint:/api/campaigns', 'method:POST']);
trackTiming('database.query', queryDuration, ['table:campaigns']);
```

---

## 🚨 CONFIGURACIÓN DE ALERTAS

### 1. AlertManager Configuration
```yaml
# alertmanager.yml
global:
  smtp_smarthost: 'smtp.gmail.com:587'
  smtp_from: 'alerts@stratoai.com'
  smtp_auth_username: 'alerts@stratoai.com'
  smtp_auth_password: 'your_password'

route:
  group_by: ['alertname']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'web.hook'
  routes:
    - match:
        severity: critical
      receiver: 'critical-alerts'
    - match:
        severity: warning
      receiver: 'warning-alerts'

receivers:
  - name: 'web.hook'
    webhook_configs:
      - url: 'http://localhost:5001/'
        
  - name: 'critical-alerts'
    email_configs:
      - to: 'devops@stratoai.com'
        subject: 'CRITICAL: {{ .GroupLabels.alertname }}'
        body: |
          {{ range .Alerts }}
          Alert: {{ .Annotations.summary }}
          Description: {{ .Annotations.description }}
          {{ end }}
    slack_configs:
      - api_url: 'YOUR_SLACK_WEBHOOK_URL'
        channel: '#alerts-critical'
        title: 'CRITICAL ALERT'
        text: '{{ range .Alerts }}{{ .Annotations.summary }}{{ end }}'
        
  - name: 'warning-alerts'
    email_configs:
      - to: 'team@stratoai.com'
        subject: 'WARNING: {{ .GroupLabels.alertname }}'
```

### 2. Slack Integration
```javascript
// src/utils/monitoring/slack.js
export async function sendSlackAlert(alert) {
  const webhook = process.env.SLACK_WEBHOOK_URL;
  
  const payload = {
    channel: alert.severity === 'critical' ? '#alerts-critical' : '#alerts-warning',
    username: 'StratoAI Monitor',
    icon_emoji: alert.severity === 'critical' ? ':rotating_light:' : ':warning:',
    attachments: [
      {
        color: alert.severity === 'critical' ? 'danger' : 'warning',
        title: alert.title,
        text: alert.description,
        fields: [
          {
            title: 'Severity',
            value: alert.severity,
            short: true
          },
          {
            title: 'Service',
            value: alert.service,
            short: true
          },
          {
            title: 'Time',
            value: new Date().toISOString(),
            short: true
          }
        ]
      }
    ]
  };
  
  await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}
```

---

## 📱 CONFIGURACIÓN DE UPTIME MONITORING

### 1. UptimeRobot Configuration
```javascript
// Endpoints to monitor
const endpoints = [
  {
    name: 'StratoAI API Health',
    url: 'https://api.stratoai.com/health',
    interval: 300, // 5 minutes
    timeout: 30
  },
  {
    name: 'StratoAI API Auth',
    url: 'https://api.stratoai.com/api/auth/profile',
    interval: 300,
    timeout: 30,
    headers: {
      'Authorization': 'Bearer test-token'
    }
  },
  {
    name: 'StratoAI Campaigns API',
    url: 'https://api.stratoai.com/api/campaigns',
    interval: 600, // 10 minutes
    timeout: 30
  }
];
```

### 2. Custom Health Check Endpoint
```javascript
// src/routes/monitoring.js
import express from 'express';
import { healthCheckManager } from '../utils/health/checks.js';
import { circuitBreakerManager } from '../utils/resilience/circuitBreaker.js';

const router = express.Router();

router.get('/health/detailed', async (req, res) => {
  const health = await healthCheckManager.runAllChecks(req);
  const circuitBreakers = circuitBreakerManager.getAllStatus();
  
  const response = {
    status: health.status,
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || '1.0.0',
    uptime: process.uptime(),
    checks: health.checks,
    circuitBreakers,
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV
  };
  
  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(response);
});

export default router;
```

---

## 📊 DASHBOARDS PERSONALIZADOS

### 1. Business Metrics Dashboard
```json
{
  "dashboard": {
    "title": "StratoAI Business Metrics",
    "panels": [
      {
        "title": "Active Users",
        "type": "singlestat",
        "targets": [
          {
            "expr": "active_users_total"
          }
        ]
      },
      {
        "title": "Campaigns Created",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(campaigns_created_total[1h])"
          }
        ]
      },
      {
        "title": "Email Delivery Rate",
        "type": "singlestat",
        "targets": [
          {
            "expr": "email_delivery_rate"
          }
        ]
      },
      {
        "title": "Repository Analysis",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(repositories_analyzed_total[1h])"
          }
        ]
      },
      {
        "title": "Revenue Metrics",
        "type": "table",
        "targets": [
          {
            "expr": "subscription_revenue_total"
          }
        ]
      }
    ]
  }
}
```

### 2. Technical Performance Dashboard
```json
{
  "dashboard": {
    "title": "StratoAI Technical Performance",
    "panels": [
      {
        "title": "API Response Times",
        "type": "heatmap",
        "targets": [
          {
            "expr": "rate(http_request_duration_seconds_bucket[5m])"
          }
        ]
      },
      {
        "title": "Database Performance",
        "type": "graph",
        "targets": [
          {
            "expr": "database_query_duration_seconds"
          }
        ]
      },
      {
        "title": "Cache Performance",
        "type": "graph",
        "targets": [
          {
            "expr": "cache_hit_rate",
            "legendFormat": "{{cache_name}}"
          }
        ]
      },
      {
        "title": "Circuit Breaker States",
        "type": "stat",
        "targets": [
          {
            "expr": "circuit_breaker_state"
          }
        ]
      }
    ]
  }
}
```

---

## 🔔 CONFIGURACIÓN DE NOTIFICACIONES

### 1. Email Notifications
```javascript
// src/utils/monitoring/notifications.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.ALERT_EMAIL_USER,
    pass: process.env.ALERT_EMAIL_PASS
  }
});

export async function sendEmailAlert(alert) {
  const mailOptions = {
    from: 'alerts@stratoai.com',
    to: getRecipients(alert.severity),
    subject: `[${alert.severity.toUpperCase()}] ${alert.title}`,
    html: `
      <h2>Alert: ${alert.title}</h2>
      <p><strong>Severity:</strong> ${alert.severity}</p>
      <p><strong>Service:</strong> ${alert.service}</p>
      <p><strong>Description:</strong> ${alert.description}</p>
      <p><strong>Time:</strong> ${new Date().toISOString()}</p>
      <p><strong>Dashboard:</strong> <a href="${alert.dashboardUrl}">View Dashboard</a></p>
    `
  };
  
  await transporter.sendMail(mailOptions);
}

function getRecipients(severity) {
  switch (severity) {
    case 'critical':
      return ['devops@stratoai.com', 'cto@stratoai.com'];
    case 'warning':
      return ['team@stratoai.com'];
    default:
      return ['logs@stratoai.com'];
  }
}
```

### 2. Discord/Teams Integration
```javascript
// src/utils/monitoring/discord.js
export async function sendDiscordAlert(alert) {
  const webhook = process.env.DISCORD_WEBHOOK_URL;
  
  const embed = {
    title: alert.title,
    description: alert.description,
    color: alert.severity === 'critical' ? 0xff0000 : 0xffa500,
    fields: [
      {
        name: 'Severity',
        value: alert.severity,
        inline: true
      },
      {
        name: 'Service',
        value: alert.service,
        inline: true
      },
      {
        name: 'Time',
        value: new Date().toISOString(),
        inline: true
      }
    ],
    timestamp: new Date().toISOString()
  };
  
  await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ embeds: [embed] })
  });
}
```

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### Fase 1: Configuración Básica (Semana 1)
- [ ] **Instalar Prometheus y Grafana**
- [ ] **Configurar métricas básicas del backend**
- [ ] **Crear dashboard principal**
- [ ] **Configurar alertas críticas**
- [ ] **Implementar uptime monitoring**

### Fase 2: Alertas y Notificaciones (Semana 2)
- [ ] **Configurar AlertManager**
- [ ] **Integrar Slack/Discord**
- [ ] **Configurar email notifications**
- [ ] **Definir escalation policies**
- [ ] **Probar todas las alertas**

### Fase 3: Dashboards Avanzados (Semana 3)
- [ ] **Crear business metrics dashboard**
- [ ] **Implementar technical performance dashboard**
- [ ] **Configurar custom metrics**
- [ ] **Añadir log aggregation**
- [ ] **Implementar distributed tracing**

### Fase 4: Optimización (Semana 4)
- [ ] **Optimizar retention policies**
- [ ] **Configurar automated remediation**
- [ ] **Implementar capacity planning**
- [ ] **Documentar runbooks**
- [ ] **Entrenar al equipo**

---

## 💰 COSTOS ESTIMADOS

### Stack Gratuito/Económico
- **Grafana Cloud**: $0-50/mes
- **UptimeRobot**: $0-20/mes
- **Sentry**: $0-26/mes
- **Total**: $0-96/mes

### Stack Profesional
- **Datadog**: $200-500/mes
- **PagerDuty**: $50-100/mes
- **Total**: $250-600/mes

### Stack Empresarial
- **Datadog Pro**: $500-1000/mes
- **New Relic**: $300-600/mes
- **PagerDuty**: $100-200/mes
- **Total**: $900-1800/mes

---

## 📞 PRÓXIMOS PASOS

1. **Seleccionar Stack**: Elegir entre las opciones según presupuesto
2. **Configurar Infraestructura**: Implementar herramientas seleccionadas
3. **Definir SLAs**: Establecer Service Level Agreements
4. **Entrenar Equipo**: Capacitar en uso de herramientas
5. **Documentar Procesos**: Crear runbooks y procedimientos

**Contacto para Implementación**: DevOps Team  
**Documentación**: Mantener actualizada con cambios  
**Revisión**: Mensual para optimización continua