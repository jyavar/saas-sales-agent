import express from 'express';
import { orchestrateEvent } from '../ai/orchestrator.js';
import { logUserInteraction } from '../services/loggingService.js';

const router = express.Router();

// Array persistente en memoria para actividades del agente
const agentActivities = [];

/**
 * @openapi
 * /api/agent/orchestrate:
 *   post:
 *     summary: Orquesta un evento de usuario en el sistema AI
 *     tags:
 *       - Agent
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - eventType
 *             properties:
 *               userId:
 *                 type: string
 *                 example: user_123
 *               eventType:
 *                 type: string
 *                 enum: [CAMPAIGN_STARTED, CAMPAIGN_VIEWED, ACTION_TAKEN]
 *                 example: CAMPAIGN_VIEWED
 *               metadata:
 *                 type: object
 *                 example: { "campaignId": "cmp_001" }
 *     responses:
 *       200:
 *         description: Orquestación completada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Orchestration complete
 *       400:
 *         description: Faltan campos requeridos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Missing required fields
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.post('/orchestrate', async (req, res) => {
  try {
    const { userId, eventType, metadata } = req.body;
    if (!userId || !eventType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // campaignId puede venir en metadata
    const campaignId = metadata?.campaignId || '';
    // Logging explícito de la llamada
    await logUserInteraction(userId, campaignId, `Orchestrator endpoint called: eventType=${eventType}, campaignId=${campaignId}`);
    await orchestrateEvent({
      userId,
      campaignId,
      event: eventType,
      metadata
    });
    // Registrar actividad en memoria
    agentActivities.push({
      timestamp: new Date().toISOString(),
      userId,
      eventType,
      campaignId,
      message: `Orchestrator endpoint called: eventType=${eventType}, campaignId=${campaignId}`
    });
    res.status(200).json({ message: 'Orchestration complete' });
  } catch (error) {
    console.error('❌ Error in orchestration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint para obtener actividades del agente
router.get('/activities', (req, res) => {
  res.json({ activities: agentActivities });
});

export default router; 