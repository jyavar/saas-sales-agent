/**
 * Strato AI Sales Agent Backend Server
 * Main entry point for the backend API with multi-tenant support
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { config } from 'dotenv';

// Import middleware
import { requestIdMiddleware, correlationIdMiddleware } from './utils/common/requestId.js';
import { logRequest } from './utils/common/logger.js';
import { globalErrorHandler, handleUnhandledRejection, handleUncaughtException } from './utils/common/errorHandler.js';
import { sanitizeRequest } from './middleware/validation.js';
import { tenantMiddleware } from './middleware/tenant.js';
import { rateLimitMiddleware } from './middleware/rateLimiter.js';

// Import routes
import { apiRouter } from './routes/api.js';
import { healthRouter } from './routes/health.js';
import { docsRouter } from './routes/docs.js';
import agentRoutes from './routes/agentRoutes.js';

// Load environment variables
config();

// Handle unhandled rejections and exceptions
handleUnhandledRejection();
handleUncaughtException();

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================================
// SECURITY MIDDLEWARE
// ============================================================================

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

// CORS configuration for multi-tenant support
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://stratoai.org',
      'https://*.stratoai.app',
      'https://app.stratoai.com',
      'https://*.cursor.sh'
    ];
    
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    // Check for wildcard domains
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin.includes('*')) {
        const pattern = allowedOrigin.replace(/\*/g, '.*');
        const regex = new RegExp(`^${pattern}$`);
        return regex.test(origin);
      }
      return allowedOrigin === origin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-API-Key',
    'X-Tenant-ID',
    'X-Request-ID',
    'X-Correlation-ID',
    'X-Agent-ID'
  ]
};

app.use(cors(corsOptions));

// ============================================================================
// GENERAL MIDDLEWARE
// ============================================================================

// Compression
app.use(compression());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request tracking
app.use(requestIdMiddleware);
app.use(correlationIdMiddleware);

// Request logging
app.use(logRequest);

// Input sanitization
app.use(sanitizeRequest);

// Rate limiting
app.use(rateLimitMiddleware);

// ============================================================================
// HEALTH CHECK ENDPOINTS (No auth required)
// ============================================================================

// Health routes (no tenant required)
app.use('/health', healthRouter);

// ============================================================================
// TENANT MIDDLEWARE (Applied to all API routes)
// ============================================================================

// Tenant detection and validation for all /api routes
app.use('/api', tenantMiddleware);

// ============================================================================
// API ROUTES (Multi-tenant enabled)
// ============================================================================

// API routes with tenant context
app.use('/api', apiRouter);

// Documentation routes
app.use('/api/docs', docsRouter);

// Agent routes
app.use('/api/agent', agentRoutes);

// ============================================================================
// ROOT ENDPOINT
// ============================================================================

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Strato AI Sales Agent Backend',
    version: process.env.APP_VERSION || '1.0.0',
    features: {
      multiTenant: true,
      cursorIntegration: true,
      frontendCompatible: true,
      subdomainSupport: true
    },
    endpoints: {
      health: '/health',
      api: '/api',
      docs: '/api/docs'
    }
  });
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

// Global error handler
app.use(globalErrorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// ============================================================================
// SERVER STARTUP
// ============================================================================

const server = app.listen(PORT, () => {
  console.log(`🚀 Strato AI Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API docs: http://localhost:${PORT}/api/docs`);
  console.log(`🏢 Multi-tenant: Enabled`);
  console.log(`🤖 CURSOR integration: Ready`);
  console.log(`🌐 Frontend compatible: Yes`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

export default app;