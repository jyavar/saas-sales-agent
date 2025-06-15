/**
 * Health check routes
 */

import express from 'express';
import { healthController } from '../controllers/healthController.js';

const router = express.Router();

// Basic health check
router.get('/', healthController.basicHealth);

// Detailed health check
router.get('/detailed', healthController.detailedHealth);

// Readiness probe
router.get('/ready', healthController.readinessProbe);

// Liveness probe
router.get('/live', healthController.livenessProbe);

export default router;