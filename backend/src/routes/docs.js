/**
 * API documentation routes
 */

import express from 'express';
import { docsController } from '../controllers/docsController.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const router = express.Router();

// Swagger JSDoc config
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'StratoAI Agent API',
    version: '1.0.0',
    description: 'API documentation for StratoAI Agent Orchestrator',
  },
};
const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'], // Ajusta si tus rutas están en otro path
};
const swaggerSpec = swaggerJSDoc(options);

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerSpec));

// Rutas de documentación custom (si existen)
router.get('/openapi.json', docsController.openApiSpec);
router.get('/multi-tenant', docsController.multiTenantGuide);
router.get('/cursor', docsController.cursorGuide);

export const docsRouter = router;