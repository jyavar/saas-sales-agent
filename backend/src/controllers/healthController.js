/**
 * Health check controller
 */

import { supabaseAdmin } from '../services/supabase.js';
import { logger } from '../utils/common/logger.js';

export class HealthController {
  /**
   * Basic health check
   */
  async basicHealth(req, res) {
    try {
      const health = {
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.APP_VERSION || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        features: {
          multiTenant: true,
          cursorIntegration: true,
          apiKeys: true,
          subdomainSupport: true,
          frontendCompatible: true
        }
      };

      res.json(health);
    } catch (error) {
      logger.error('Health check failed', { error: error.message });
      res.status(503).json({
        success: false,
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Detailed health check with external services
   */
  async detailedHealth(req, res) {
    try {
      const checks = {
        database: await this.checkDatabase(),
        memory: this.checkMemory(),
        disk: this.checkDisk(),
        environment: this.checkEnvironment()
      };

      const allHealthy = Object.values(checks).every(check => check.status === 'healthy');

      const health = {
        success: allHealthy,
        status: allHealthy ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.APP_VERSION || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        checks,
        features: {
          multiTenant: true,
          cursorIntegration: true,
          apiKeys: true,
          subdomainSupport: true,
          frontendCompatible: true,
          cors: true,
          rateLimiting: true,
          tenantIsolation: true
        }
      };

      const statusCode = allHealthy ? 200 : 503;
      res.status(statusCode).json(health);
    } catch (error) {
      logger.error('Detailed health check failed', { error: error.message });
      res.status(503).json({
        success: false,
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Readiness probe
   */
  async readinessProbe(req, res) {
    try {
      // Check if all critical services are ready
      const dbCheck = await this.checkDatabase();
      const envCheck = this.checkEnvironment();

      const ready = dbCheck.status === 'healthy' && envCheck.status === 'healthy';

      if (ready) {
        res.json({
          success: true,
          status: 'ready',
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(503).json({
          success: false,
          status: 'not_ready',
          timestamp: new Date().toISOString(),
          checks: { database: dbCheck, environment: envCheck }
        });
      }
    } catch (error) {
      res.status(503).json({
        success: false,
        status: 'not_ready',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Liveness probe
   */
  async livenessProbe(req, res) {
    try {
      // Simple check that the application is alive
      const memoryCheck = this.checkMemory();
      
      if (memoryCheck.status === 'healthy') {
        res.json({
          success: true,
          status: 'alive',
          timestamp: new Date().toISOString(),
          uptime: process.uptime()
        });
      } else {
        res.status(503).json({
          success: false,
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          memory: memoryCheck
        });
      }
    } catch (error) {
      res.status(503).json({
        success: false,
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Check database connectivity
   */
  async checkDatabase() {
    try {
      const start = Date.now();
      
      // Simple query to check connectivity
      const { data, error } = await supabaseAdmin
        .from('tenants')
        .select('count')
        .limit(1);

      const duration = Date.now() - start;

      if (error) {
        return {
          status: 'unhealthy',
          error: error.message,
          duration
        };
      }

      return {
        status: 'healthy',
        duration,
        message: 'Database connection successful'
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }

  /**
   * Check memory usage
   */
  checkMemory() {
    try {
      const usage = process.memoryUsage();
      const totalMB = Math.round(usage.rss / 1024 / 1024);
      const heapUsedMB = Math.round(usage.heapUsed / 1024 / 1024);
      const heapTotalMB = Math.round(usage.heapTotal / 1024 / 1024);

      // Consider unhealthy if using more than 1GB
      const isHealthy = totalMB < 1024;

      return {
        status: isHealthy ? 'healthy' : 'warning',
        usage: {
          rss: `${totalMB}MB`,
          heapUsed: `${heapUsedMB}MB`,
          heapTotal: `${heapTotalMB}MB`,
          external: `${Math.round(usage.external / 1024 / 1024)}MB`
        },
        warning: !isHealthy ? 'High memory usage detected' : null
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }

  /**
   * Check disk space (simplified)
   */
  checkDisk() {
    try {
      // In a real implementation, you'd check actual disk space
      // For now, just return healthy
      return {
        status: 'healthy',
        message: 'Disk space check not implemented'
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }

  /**
   * Check environment configuration
   */
  checkEnvironment() {
    try {
      const requiredVars = [
        'SUPABASE_URL',
        'SUPABASE_ANON_KEY',
        'JWT_SECRET',
        'AGENT_SECRET_TOKEN'
      ];

      const missing = requiredVars.filter(varName => !process.env[varName]);

      if (missing.length > 0) {
        return {
          status: 'unhealthy',
          error: `Missing environment variables: ${missing.join(', ')}`
        };
      }

      return {
        status: 'healthy',
        message: 'All required environment variables are set',
        nodeEnv: process.env.NODE_ENV,
        port: process.env.PORT || 3000
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }
}

export const healthController = new HealthController();
export default healthController;