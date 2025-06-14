# ✅ CHECKLIST DE DEPLOYMENT A PRODUCCIÓN

## 🎯 PRE-DEPLOYMENT CHECKLIST

### **🔒 Seguridad**
- [ ] **JWT_SECRET** configurado con 32+ caracteres
- [ ] **AGENT_SECRET_TOKEN** configurado para CURSOR
- [ ] **SUPABASE_SERVICE_ROLE_KEY** configurado (CRÍTICO)
- [ ] **STRIPE_SECRET_KEY** configurado para pagos
- [ ] **RESEND_API_KEY** configurado para emails
- [ ] **CORS origins** configurados para dominios de producción
- [ ] **Rate limiting** configurado apropiadamente
- [ ] **Headers de seguridad** habilitados

### **🗄️ Base de Datos**
- [ ] **Migraciones ejecutadas** en Supabase
- [ ] **RLS policies** habilitadas
- [ ] **Índices creados** para performance
- [ ] **Backup configurado** automáticamente
- [ ] **Connection pooling** configurado

### **📊 Monitoreo**
- [ ] **Health checks** funcionando
- [ ] **Logging estructurado** configurado
- [ ] **Sentry DSN** configurado (opcional)
- [ ] **Métricas** habilitadas
- [ ] **Alertas** configuradas

### **🚀 Performance**
- [ ] **Caché configurado** con TTL apropiados
- [ ] **Compresión** habilitada
- [ ] **Rate limiting** optimizado
- [ ] **Memory limits** configurados

---

## 🔧 VARIABLES DE ENTORNO CRÍTICAS

### **Variables Obligatorias**
```bash
# CRÍTICO - Sin estas variables el sistema no funciona
JWT_SECRET=tu_jwt_secret_de_32_caracteres_minimo
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key  # CRÍTICO

# Para CURSOR
AGENT_SECRET_TOKEN=sk-strato-agent-2025-secure-token-for-cursor-ai-agents

# Para servicios externos
STRIPE_SECRET_KEY=sk_live_tu_stripe_key
RESEND_API_KEY=re_tu_resend_key
```

### **Variables de Configuración**
```bash
# Servidor
NODE_ENV=production
PORT=3000
APP_VERSION=1.0.0

# Seguridad
ALLOWED_ORIGINS=https://tu-frontend.com,https://app.tu-dominio.com
ENABLE_HTTPS_REDIRECT=true
ENABLE_SECURITY_HEADERS=true

# Logging
LOG_LEVEL=info
SENTRY_DSN=tu_sentry_dsn  # Opcional
```

---

## 🚀 PASOS DE DEPLOYMENT

### **PASO 1: Preparación**
```bash
# 1. Clonar repositorio
git clone tu-repositorio
cd strato-ai-backend

# 2. Instalar dependencias
npm ci --production

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con valores de producción
```

### **PASO 2: Base de Datos**
```bash
# 1. Ejecutar migraciones en Supabase
# (Desde Supabase Dashboard > SQL Editor)

# 2. Verificar tablas creadas
# - profiles
# - tenants
# - tenant_members
# - leads
# - lead_interactions
# - agent_actions
# - api_keys

# 3. Verificar RLS policies habilitadas
```

### **PASO 3: Verificación**
```bash
# 1. Verificar configuración
npm run health:check

# 2. Ejecutar tests
npm test

# 3. Verificar endpoints críticos
curl https://tu-api.com/health
curl https://tu-api.com/api/status/health
```

### **PASO 4: Inicio**
```bash
# Producción
npm start

# O con PM2
pm2 start src/server.js --name "strato-ai-backend"
pm2 save
pm2 startup
```

---

## 🔍 VERIFICACIÓN POST-DEPLOYMENT

### **Health Checks**
```bash
# 1. Health básico
curl https://tu-api.com/health

# 2. Health detallado (requiere auth admin)
curl -H "Authorization: Bearer admin-token" \
     https://tu-api.com/api/status/health/detailed

# 3. Readiness
curl https://tu-api.com/api/status/ready

# 4. Liveness
curl https://tu-api.com/api/status/live
```

### **Endpoints CURSOR**
```bash
# Probar endpoint principal
curl -X POST https://tu-api.com/api/agent-actions \
  -H "Authorization: Bearer sk-strato-agent-2025-secure-token-for-cursor-ai-agents" \
  -H "Content-Type: application/json" \
  -d '{
    "actionType": "health_check",
    "agentId": "cursor-test"
  }'
```

### **Endpoints Frontend**
```bash
# Probar autenticación (requiere usuario válido)
curl -X POST https://tu-api.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Probar leads
curl -H "Authorization: Bearer jwt-token" \
     https://tu-api.com/api/leads
```

---

## 📊 MONITOREO EN PRODUCCIÓN

### **Métricas Clave**
- **Response Time**: <500ms promedio
- **Error Rate**: <5%
- **Memory Usage**: <512MB
- **CPU Usage**: <70%
- **Database Connections**: Monitoreadas

### **Alertas Configurar**
- **Error rate > 5%**: Alerta inmediata
- **Response time > 2s**: Alerta warning
- **Memory > 80%**: Alerta warning
- **Database down**: Alerta crítica
- **Rate limit violations**: Monitoreo

### **Logs Importantes**
```bash
# Ver logs en tiempo real
tail -f logs/app.log

# Filtrar errores
grep "ERROR" logs/app.log

# Ver métricas
curl https://tu-api.com/api/status/metrics
```

---

## 🚨 TROUBLESHOOTING

### **Problemas Comunes**

#### **1. Error 503 - Service Unavailable**
```bash
# Verificar variables de entorno
echo $SUPABASE_SERVICE_ROLE_KEY
echo $JWT_SECRET

# Verificar conectividad a Supabase
curl -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
     "$SUPABASE_URL/rest/v1/profiles?select=count"
```

#### **2. Error 401 - Unauthorized**
```bash
# Verificar token CURSOR
echo $AGENT_SECRET_TOKEN

# Verificar JWT secret
echo $JWT_SECRET
```

#### **3. Database Connection Failed**
```bash
# Verificar URL y keys de Supabase
echo $SUPABASE_URL
echo $SUPABASE_ANON_KEY
echo $SUPABASE_SERVICE_ROLE_KEY

# Probar conectividad
curl "$SUPABASE_URL/rest/v1/"
```

#### **4. CORS Errors**
```bash
# Verificar orígenes permitidos
echo $ALLOWED_ORIGINS

# Debe incluir dominios del frontend
# Ejemplo: https://app.tu-dominio.com,https://tu-dominio.com
```

### **Comandos de Debug**
```bash
# Ver estado del proceso
ps aux | grep node

# Ver uso de memoria
free -h

# Ver logs de sistema
journalctl -u tu-servicio -f

# Ver conexiones de red
netstat -tulpn | grep :3000
```

---

## 🔄 ROLLBACK PLAN

### **Si algo sale mal:**

#### **1. Rollback Inmediato**
```bash
# Parar servicio actual
pm2 stop strato-ai-backend

# Volver a versión anterior
git checkout previous-working-commit
npm ci --production
pm2 start src/server.js --name "strato-ai-backend"
```

#### **2. Rollback de Base de Datos**
```bash
# Si hay problemas con migraciones
# Restaurar desde backup en Supabase Dashboard
```

#### **3. Verificar Rollback**
```bash
# Verificar que todo funciona
curl https://tu-api.com/health
curl https://tu-api.com/api/status/health
```

---

## 📋 CHECKLIST FINAL

### **Antes de Declarar Éxito**
- [ ] **Health checks** responden OK
- [ ] **CURSOR endpoint** funciona
- [ ] **Frontend endpoints** funcionan
- [ ] **Base de datos** conecta correctamente
- [ ] **Logs** se generan correctamente
- [ ] **Rate limiting** funciona
- [ ] **CORS** configurado para frontend
- [ ] **Monitoreo** activo
- [ ] **Alertas** configuradas
- [ ] **Backup** funcionando

### **Documentar**
- [ ] **URL de producción** documentada
- [ ] **Tokens de acceso** seguros
- [ ] **Procedimientos de monitoreo** documentados
- [ ] **Contactos de emergencia** actualizados
- [ ] **Runbooks** creados

---

## 📞 INFORMACIÓN DE PRODUCCIÓN

### **URLs de Producción**
```
API Base: https://api.tu-dominio.com
Health: https://api.tu-dominio.com/health
Docs: https://api.tu-dominio.com/api/docs
CURSOR Endpoint: https://api.tu-dominio.com/api/agent-actions
```

### **Tokens de Acceso**
```
CURSOR Token: sk-strato-agent-2025-secure-token-for-cursor-ai-agents
Frontend: JWT tokens via /api/auth/login
```

### **Contactos de Emergencia**
- **DevOps**: devops@tu-empresa.com
- **Backend Lead**: backend@tu-empresa.com
- **On-call**: +1-XXX-XXX-XXXX

---

**🎯 Una vez completado este checklist, el backend estará listo para producción y podrá manejar tráfico real de CURSOR y el frontend Next.js.**

**Estado**: ✅ PRODUCTION READY  
**Última Verificación**: ${new Date().toISOString()}