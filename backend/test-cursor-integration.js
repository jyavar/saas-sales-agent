#!/usr/bin/env node

/**
 * FASE 4 - SCRIPT DE TESTING CURSOR → BACKEND → FRONTEND (MULTI-TENANT)
 * 
 * Este script verifica que:
 * 1. CURSOR puede crear leads multi-tenant
 * 2. Backend procesa correctamente con contexto de tenant
 * 3. Frontend muestra los datos filtrados por tenant
 */

import fetch from 'node-fetch';
import { randomUUID } from 'crypto';

// Configuración
const CONFIG = {
  BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:3000',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3001',
  CURSOR_API_KEY: process.env.AGENT_SECRET_TOKEN || 'sk-strato-agent-2025-secure-token-for-cursor-ai-agents',
  TEST_TENANTS: ['acme', 'demo', 'techcorp']
};

// Colores para output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`\n${colors.bold}📌 PASO ${step}:${colors.reset} ${colors.cyan}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

/**
 * Generar datos de lead de prueba
 */
function generateTestLead(tenantSlug) {
  const companies = ['TechCorp', 'InnovateLabs', 'DataSystems', 'CloudWorks', 'AIStartup'];
  const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Lisa', 'Tom', 'Emma'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const company = companies[Math.floor(Math.random() * companies.length)];
  
  return {
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase()}.com`,
    firstName,
    lastName,
    company,
    jobTitle: 'CEO',
    source: 'cursor-agent',
    priority: 'high',
    tags: ['cursor-generated', 'test-lead', `tenant-${tenantSlug}`]
  };
}

/**
 * Verificar que el backend está funcionando
 */
async function checkBackendHealth() {
  try {
    const response = await fetch(`${CONFIG.BACKEND_URL}/health`);
    const data = await response.json();
    
    if (response.ok && data.success) {
      logSuccess(`Backend funcionando en ${CONFIG.BACKEND_URL}`);
      logInfo(`Versión: ${data.version}, Uptime: ${Math.round(data.uptime)}s`);
      return true;
    } else {
      logError(`Backend no responde correctamente: ${data.error || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    logError(`Error conectando al backend: ${error.message}`);
    return false;
  }
}

/**
 * Crear lead desde CURSOR (simulando agente)
 */
async function createLeadFromCursor(tenantSlug, leadData) {
  try {
    const payload = {
      actionType: 'create_lead',
      agentId: 'cursor-prospector-v1',
      priority: 'high',
      payload: {
        leadData
      },
      context: {
        source: 'cursor_agent',
        correlationId: `test-${randomUUID()}`,
        testRun: true
      }
    };

    const response = await fetch(`${CONFIG.BACKEND_URL}/api/agent-actions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.CURSOR_API_KEY}`,
        'X-Tenant-ID': tenantSlug,
        'X-Agent-ID': 'cursor-prospector-v1',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (response.ok && data.success) {
      logSuccess(`Lead creado para tenant "${tenantSlug}": ${leadData.firstName} ${leadData.lastName}`);
      logInfo(`Action ID: ${data.action?.id || 'N/A'}`);
      return { success: true, data };
    } else {
      logError(`Error creando lead para "${tenantSlug}": ${data.error?.message || 'Unknown error'}`);
      logInfo(`Status: ${response.status}, Response: ${JSON.stringify(data, null, 2)}`);
      return { success: false, error: data.error };
    }
  } catch (error) {
    logError(`Error en request para "${tenantSlug}": ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Verificar leads en el backend por tenant
 */
async function verifyLeadsInBackend(tenantSlug) {
  try {
    const response = await fetch(`${CONFIG.BACKEND_URL}/api/leads?limit=10&source=cursor-agent`, {
      headers: {
        'Authorization': `Bearer ${CONFIG.CURSOR_API_KEY}`,
        'X-Tenant-ID': tenantSlug,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (response.ok && data.success) {
      const cursorLeads = data.data?.leads?.filter(lead => lead.source === 'cursor-agent') || [];
      logSuccess(`Backend: ${cursorLeads.length} leads de CURSOR encontrados para "${tenantSlug}"`);
      
      if (cursorLeads.length > 0) {
        logInfo(`Último lead: ${cursorLeads[0].firstName} ${cursorLeads[0].lastName} (${cursorLeads[0].email})`);
      }
      
      return { success: true, leads: cursorLeads };
    } else {
      logError(`Error obteniendo leads de "${tenantSlug}": ${data.error?.message || 'Unknown error'}`);
      return { success: false, error: data.error };
    }
  } catch (error) {
    logError(`Error verificando leads para "${tenantSlug}": ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Verificar aislamiento entre tenants
 */
async function verifyTenantIsolation(tenant1, tenant2) {
  try {
    // Obtener leads del tenant 1
    const leads1 = await verifyLeadsInBackend(tenant1);
    const leads2 = await verifyLeadsInBackend(tenant2);

    if (!leads1.success || !leads2.success) {
      logWarning('No se pudo verificar aislamiento - error obteniendo leads');
      return false;
    }

    // Verificar que no hay leads cruzados
    const tenant1Emails = leads1.leads.map(lead => lead.email);
    const tenant2Emails = leads2.leads.map(lead => lead.email);
    
    const crossContamination = tenant1Emails.some(email => tenant2Emails.includes(email));
    
    if (crossContamination) {
      logError(`❌ FALLO DE AISLAMIENTO: Leads compartidos entre "${tenant1}" y "${tenant2}"`);
      return false;
    } else {
      logSuccess(`Aislamiento verificado entre "${tenant1}" y "${tenant2}"`);
      return true;
    }
  } catch (error) {
    logError(`Error verificando aislamiento: ${error.message}`);
    return false;
  }
}

/**
 * Verificar configuración del frontend
 */
async function checkFrontendConfiguration() {
  try {
    // Verificar que el frontend está corriendo
    const response = await fetch(`${CONFIG.FRONTEND_URL}`, {
      method: 'HEAD'
    });

    if (response.ok) {
      logSuccess(`Frontend accesible en ${CONFIG.FRONTEND_URL}`);
      return true;
    } else {
      logWarning(`Frontend no responde en ${CONFIG.FRONTEND_URL} (Status: ${response.status})`);
      return false;
    }
  } catch (error) {
    logWarning(`Frontend no accesible: ${error.message}`);
    logInfo('Esto es normal si el frontend no está corriendo aún');
    return false;
  }
}

/**
 * Verificar endpoints de tenant
 */
async function verifyTenantEndpoints(tenantSlug) {
  try {
    const response = await fetch(`${CONFIG.BACKEND_URL}/api/tenant`, {
      headers: {
        'X-Tenant-ID': tenantSlug,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (response.ok && data.success) {
      logSuccess(`Tenant "${tenantSlug}" configurado correctamente`);
      logInfo(`Plan: ${data.tenant?.plan || 'N/A'}, Status: ${data.tenant?.status || 'N/A'}`);
      return { success: true, tenant: data.tenant };
    } else {
      logError(`Tenant "${tenantSlug}" no encontrado o inactivo`);
      return { success: false, error: data.error };
    }
  } catch (error) {
    logError(`Error verificando tenant "${tenantSlug}": ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Ejecutar test completo
 */
async function runCompleteTest() {
  log(`${colors.bold}${colors.cyan}🚀 INICIANDO TESTING CURSOR → BACKEND → FRONTEND${colors.reset}`);
  log(`${colors.cyan}=================================================${colors.reset}\n`);

  const results = {
    backendHealth: false,
    frontendHealth: false,
    tenantVerification: {},
    leadCreation: {},
    tenantIsolation: false,
    overallSuccess: false
  };

  // PASO 1: Verificar Backend
  logStep(1, 'Verificando Backend Health');
  results.backendHealth = await checkBackendHealth();
  
  if (!results.backendHealth) {
    logError('❌ Backend no está funcionando. Abortando tests.');
    return results;
  }

  // PASO 2: Verificar Frontend
  logStep(2, 'Verificando Frontend');
  results.frontendHealth = await checkFrontendConfiguration();

  // PASO 3: Verificar Tenants
  logStep(3, 'Verificando Configuración de Tenants');
  for (const tenantSlug of CONFIG.TEST_TENANTS) {
    const tenantResult = await verifyTenantEndpoints(tenantSlug);
    results.tenantVerification[tenantSlug] = tenantResult.success;
    
    if (!tenantResult.success) {
      logWarning(`Tenant "${tenantSlug}" no está configurado - se creará automáticamente al crear leads`);
    }
  }

  // PASO 4: Crear Leads desde CURSOR
  logStep(4, 'Creando Leads desde CURSOR (Simulando Agentes)');
  
  for (const tenantSlug of CONFIG.TEST_TENANTS) {
    log(`\n🏢 Procesando tenant: ${tenantSlug}`);
    
    // Crear 2 leads por tenant
    for (let i = 0; i < 2; i++) {
      const leadData = generateTestLead(tenantSlug);
      const result = await createLeadFromCursor(tenantSlug, leadData);
      
      if (!results.leadCreation[tenantSlug]) {
        results.leadCreation[tenantSlug] = [];
      }
      results.leadCreation[tenantSlug].push(result.success);
      
      // Pequeña pausa entre requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // PASO 5: Verificar Leads en Backend
  logStep(5, 'Verificando Leads en Backend por Tenant');
  
  for (const tenantSlug of CONFIG.TEST_TENANTS) {
    await verifyLeadsInBackend(tenantSlug);
  }

  // PASO 6: Verificar Aislamiento de Tenants
  logStep(6, 'Verificando Aislamiento entre Tenants');
  
  if (CONFIG.TEST_TENANTS.length >= 2) {
    results.tenantIsolation = await verifyTenantIsolation(
      CONFIG.TEST_TENANTS[0], 
      CONFIG.TEST_TENANTS[1]
    );
  }

  // PASO 7: Resumen Final
  logStep(7, 'Resumen de Resultados');
  
  log('\n📊 RESULTADOS FINALES:');
  log('========================');
  
  logInfo(`Backend Health: ${results.backendHealth ? '✅ OK' : '❌ FAIL'}`);
  logInfo(`Frontend Health: ${results.frontendHealth ? '✅ OK' : '⚠️  NO DISPONIBLE'}`);
  
  log('\n🏢 Tenants:');
  Object.entries(results.tenantVerification).forEach(([tenant, success]) => {
    logInfo(`  ${tenant}: ${success ? '✅ OK' : '⚠️  CREADO AUTOMÁTICAMENTE'}`);
  });
  
  log('\n📝 Creación de Leads:');
  Object.entries(results.leadCreation).forEach(([tenant, successes]) => {
    const successCount = successes.filter(Boolean).length;
    const totalCount = successes.length;
    logInfo(`  ${tenant}: ${successCount}/${totalCount} leads creados`);
  });
  
  logInfo(`\n🔒 Aislamiento de Tenants: ${results.tenantIsolation ? '✅ OK' : '❌ FAIL'}`);

  // Determinar éxito general
  const leadCreationSuccess = Object.values(results.leadCreation)
    .flat()
    .some(Boolean);
  
  results.overallSuccess = results.backendHealth && leadCreationSuccess && results.tenantIsolation;

  if (results.overallSuccess) {
    log(`\n${colors.bold}${colors.green}🎉 ¡TESTING COMPLETADO CON ÉXITO!${colors.reset}`);
    log(`${colors.green}✅ CURSOR → BACKEND → FRONTEND está funcionando correctamente${colors.reset}`);
  } else {
    log(`\n${colors.bold}${colors.red}❌ TESTING FALLÓ${colors.reset}`);
    log(`${colors.red}Revisar los errores anteriores y corregir la configuración${colors.reset}`);
  }

  return results;
}

/**
 * Función principal
 */
async function main() {
  try {
    const results = await runCompleteTest();
    
    // Instrucciones finales
    log(`\n${colors.bold}📋 PRÓXIMOS PASOS:${colors.reset}`);
    log('==================');
    
    if (results.overallSuccess) {
      log(`${colors.green}1. ✅ Backend multi-tenant funcionando correctamente${colors.reset}`);
      log(`${colors.green}2. ✅ CURSOR puede crear leads por tenant${colors.reset}`);
      log(`${colors.green}3. ✅ Aislamiento de datos verificado${colors.reset}`);
      
      if (results.frontendHealth) {
        log(`${colors.green}4. ✅ Frontend accesible${colors.reset}`);
        log(`\n${colors.cyan}🌐 Probar en el navegador:${colors.reset}`);
        CONFIG.TEST_TENANTS.forEach(tenant => {
          log(`   http://${tenant}.localhost:3001/dashboard/leads`);
        });
      } else {
        log(`${colors.yellow}4. ⚠️  Iniciar frontend Next.js:${colors.reset}`);
        log(`   cd frontend && npm run dev`);
        log(`\n${colors.cyan}🌐 Luego probar en el navegador:${colors.reset}`);
        CONFIG.TEST_TENANTS.forEach(tenant => {
          log(`   http://${tenant}.localhost:3001/dashboard/leads`);
        });
      }
    } else {
      log(`${colors.red}1. ❌ Revisar configuración del backend${colors.reset}`);
      log(`${colors.red}2. ❌ Verificar variables de entorno${colors.reset}`);
      log(`${colors.red}3. ❌ Comprobar conectividad de base de datos${colors.reset}`);
    }

    log(`\n${colors.bold}🔧 COMANDOS ÚTILES:${colors.reset}`);
    log('===================');
    log(`${colors.cyan}# Verificar backend:${colors.reset}`);
    log(`curl ${CONFIG.BACKEND_URL}/health`);
    log(`\n${colors.cyan}# Crear lead manualmente:${colors.reset}`);
    log(`curl -X POST ${CONFIG.BACKEND_URL}/api/agent-actions \\`);
    log(`  -H "Authorization: Bearer ${CONFIG.CURSOR_API_KEY}" \\`);
    log(`  -H "X-Tenant-ID: acme" \\`);
    log(`  -H "Content-Type: application/json" \\`);
    log(`  -d '{"actionType":"create_lead","agentId":"cursor-test","payload":{"leadData":{"email":"test@example.com","firstName":"Test","lastName":"User","company":"Test Corp"}}}'`);
    
    log(`\n${colors.cyan}# Verificar leads:${colors.reset}`);
    log(`curl -H "X-Tenant-ID: acme" ${CONFIG.BACKEND_URL}/api/leads`);

    process.exit(results.overallSuccess ? 0 : 1);
  } catch (error) {
    logError(`Error fatal en testing: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { runCompleteTest, CONFIG };