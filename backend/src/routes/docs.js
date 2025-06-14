/**
 * API documentation routes
 */

import express from 'express';
import { docsController } from '../controllers/docsController.js';

const router = express.Router();

// Swagger UI
router.get('/', docsController.swaggerUI);

// OpenAPI specification
router.get('/openapi.json', docsController.openApiSpec);

// Multi-tenant API guide
router.get('/multi-tenant', docsController.multiTenantGuide);

// CURSOR integration guide
router.get('/cursor', docsController.cursorGuide);

export default router;