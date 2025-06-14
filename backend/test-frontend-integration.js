#!/usr/bin/env node

/**
 * TESTING ESPECÍFICO FRONTEND - Verificar integración con backend multi-tenant
 */

import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

const CONFIG = {
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3001',
  BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:3000',
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
 * Verificar que el frontend responde
 */
async function checkFrontendHealth() {
  try {
    const response = await fetch(`${CONFIG.FRONTEND_URL}`);
    
    if (response.ok) {
      logSuccess(`Frontend accesible en ${CONFIG.FRONTEND_URL}`);
      return true;
    } else {
      logError(`Frontend responde con error: ${response.status}`);
      return false;
    }
  } catch (error) {
    logError(`Frontend no accesible: ${error.message}`);
    return false;
  }
}

/**
 * Verificar middleware de tenant
 */
async function testTenantMiddleware(tenantSlug) {
  try {
    // Simular request con subdomain
    const response = await fetch(`${CONFIG.FRONTEND_URL}`, {
      headers: {
        'Host': `${tenantSlug}.localhost:3001`,
        'User-Agent': 'Mozilla/5.0 (Test Browser)'
      }
    });

    if (response.ok) {
      const html = await response.text();
      
      // Verificar que el HTML contiene referencias al tenant
      if (html.includes(tenantSlug) || html.includes('tenant')) {
        logSuccess(`Middleware detecta tenant "${tenantSlug}" correctamente`);
        return true;
      } else {
        logWarning(`Middleware no detecta tenant "${tenantSlug}"`);
        return false;
      }
    } else {
      logError(`Error en middleware para "${tenantSlug}": ${response.status}`);
      return false;
    }
  } catch (error) {
    logError(`Error probando middleware para "${tenantSlug}": ${error.message}`);
    return false;
  }
}

/**
 * Verificar API calls del frontend
 */
async function testFrontendApiCalls(tenantSlug) {
  try {
    // Simular llamada que haría el frontend
    const response = await fetch(`${CONFIG.BACKEND_URL}/api/tenant`, {
      headers: {
        'X-Tenant-ID': tenantSlug,
        'Content-Type': 'application/json',
        'Origin': `http://${tenantSlug}.localhost:3001`,
        'Referer': `http://${tenantSlug}.localhost:3001/dashboard`
      }
    });

    const data = await response.json();

    if (response.ok && data.success) {
      logSuccess(`API call para tenant "${tenantSlug}" exitosa`);
      logInfo(`Tenant: ${data.tenant?.name || 'N/A'}, Plan: ${data.tenant?.plan || 'N/A'}`);
      return true;
    } else {
      logError(`API call falló para "${tenantSlug}": ${data.error?.message || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    logError(`Error en API call para "${tenantSlug}": ${error.message}`);
    return false;
  }
}

/**
 * Verificar CORS configuration
 */
async function testCorsConfiguration() {
  try {
    const response = await fetch(`${CONFIG.BACKEND_URL}/api/leads`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://acme.localhost:3001',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'X-Tenant-ID, Authorization'
      }
    });

    const corsHeaders = {
      'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
      'access-control-allow-methods': response.headers.get('access-control-allow-methods'),
      'access-control-allow-headers': response.headers.get('access-control-allow-headers')
    };

    if (corsHeaders['access-control-allow-origin']) {
      logSuccess('CORS configurado correctamente');
      logInfo(`Origin permitido: ${corsHeaders['access-control-allow-origin']}`);
      return true;
    } else {
      logError('CORS no configurado correctamente');
      return false;
    }
  } catch (error) {
    logError(`Error verificando CORS: ${error.message}`);
    return false;
  }
}

/**
 * Verificar rutas del frontend
 */
async function testFrontendRoutes(tenantSlug) {
  const routes = [
    '/',
    '/dashboard',
    '/leads',
    '/campaigns',
    '/settings'
  ];

  const results = [];

  for (const route of routes) {
    try {
      const response = await fetch(`${CONFIG.FRONTEND_URL}${route}`, {
        headers: {
          'Host': `${tenantSlug}.localhost:3001`
        }
      });

      if (response.ok) {
        logSuccess(`Ruta "${route}" accesible para "${tenantSlug}"`);
        results.push(true);
      } else {
        logWarning(`Ruta "${route}" no accesible para "${tenantSlug}": ${response.status}`);
        results.push(false);
      }
    } catch (error) {
      logError(`Error en ruta "${route}" para "${tenantSlug}": ${error.message}`);
      results.push(false);
    }
  }

  const successCount = results.filter(Boolean).length;
  logInfo(`${successCount}/${routes.length} rutas funcionando para "${tenantSlug}"`);
  
  return successCount > 0;
}

/**
 * Test principal del frontend
 */
async function runFrontendTest() {
  log(`${colors.bold}${colors.cyan}🌐 TESTING FRONTEND MULTI-TENANT${colors.reset}`);
  log(`${colors.cyan}=================================${colors.reset}\n`);

  const results = {
    frontendHealth: false,
    corsConfiguration: false,
    tenantMiddleware: {},
    apiCalls: {},
    routes: {},
    overallSuccess: false
  };

  // 1. Verificar Frontend Health
  log(`${colors.bold}📌 PASO 1: Verificando Frontend Health${colors.reset}`);
  results.frontendHealth = await checkFrontendHealth();

  if (!results.frontendHealth) {
    logError('❌ Frontend no está funcionando. Abortando tests.');
    logInfo('💡 Ejecutar: cd frontend && npm run dev');
    return results;
  }

  // 2. Verificar CORS
  log(`\n${colors.bold}📌 PASO 2: Verificando CORS Configuration${colors.reset}`);
  results.corsConfiguration = await testCorsConfiguration();

  // 3. Verificar Middleware de Tenant
  log(`\n${colors.bold}📌 PASO 3: Verificando Tenant Middleware${colors.reset}`);
  for (const tenantSlug of CONFIG.TEST_TENANTS) {
    results.tenantMiddleware[tenantSlug] = await testTenantMiddleware(tenantSlug);
  }

  // 4. Verificar API Calls
  log(`\n${colors.bold}📌 PASO 4: Verificando API Calls del Frontend${colors.reset}`);
  for (const tenantSlug of CONFIG.TEST_TENANTS) {
    results.apiCalls[tenantSlug] = await testFrontendApiCalls(tenantSlug);
  }

  // 5. Verificar Rutas
  log(`\n${colors.bold}📌 PASO 5: Verificando Rutas del Frontend${colors.reset}`);
  for (const tenantSlug of CONFIG.TEST_TENANTS) {
    results.routes[tenantSlug] = await testFrontendRoutes(tenantSlug);
  }

  // Resumen
  log(`\n${colors.bold}📊 RESUMEN DE RESULTADOS:${colors.reset}`);
  log('==========================');
  
  logInfo(`Frontend Health: ${results.frontendHealth ? '✅ OK' : '❌ FAIL'}`);
  logInfo(`CORS Configuration: ${results.corsConfiguration ? '✅ OK' : '❌ FAIL'}`);
  
  log('\n🏢 Por Tenant:');
  CONFIG.TEST_TENANTS.forEach(tenant => {
    const middleware = results.tenantMiddleware[tenant] ? '✅' : '❌';
    const apiCalls = results.apiCalls[tenant] ? '✅' : '❌';
    const routes = results.routes[tenant] ? '✅' : '❌';
    
    logInfo(`  ${tenant}:`);
    logInfo(`    Middleware: ${middleware}`);
    logInfo(`    API Calls: ${apiCalls}`);
    logInfo(`    Routes: ${routes}`);
  });

  // Determinar éxito general
  const middlewareSuccess = Object.values(results.tenantMiddleware).some(Boolean);
  const apiCallsSuccess = Object.values(results.apiCalls).some(Boolean);
  const routesSuccess = Object.values(results.routes).some(Boolean);

  results.overallSuccess = results.frontendHealth && 
                          results.corsConfiguration && 
                          middlewareSuccess && 
                          apiCallsSuccess && 
                          routesSuccess;

  if (results.overallSuccess) {
    log(`\n${colors.bold}${colors.green}🎉 ¡FRONTEND TESTING EXITOSO!${colors.reset}`);
    log(`${colors.green}✅ Frontend multi-tenant funcionando correctamente${colors.reset}`);
    
    log(`\n${colors.cyan}🌐 URLs para probar:${colors.reset}`);
    CONFIG.TEST_TENANTS.forEach(tenant => {
      log(`   http://${tenant}.localhost:3001`);
      log(`   http://${tenant}.localhost:3001/dashboard`);
      log(`   http://${tenant}.localhost:3001/leads`);
    });
  } else {
    log(`\n${colors.bold}${colors.red}❌ FRONTEND TESTING FALLÓ${colors.reset}`);
    log(`${colors.red}Revisar configuración del frontend y backend${colors.reset}`);
  }

  return results;
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runFrontendTest().then(results => {
    process.exit(results.overallSuccess ? 0 : 1);
  }).catch(error => {
    console.error('Error fatal:', error);
    process.exit(1);
  });
}

export { runFrontendTest };