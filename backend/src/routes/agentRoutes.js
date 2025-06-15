import express from 'express';
import { z } from 'zod';
import { orchestrateEvent } from '../ai/orchestrator.js';
import { logUserInteraction } from '../utils/common/logger.js';
import { supabaseAdmin } from '../services/supabase.js';

const router = express.Router();

const AgentEventSchema = z.object({
  userId: z.string(),
  eventType: z.string(),
  campaignId: z.string().optional(),
  agentId: z.string().optional(), // para seleccionar personalidad o flujo
});

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
  const parseResult = AgentEventSchema.safeParse(req.body);
  if (!parseResult.success) return res.status(400).json({ error: 'Invalid input' });

  const { userId, eventType, campaignId, agentId = 'sales' } = parseResult.data;

  logUserInteraction(`Agent triggered: user=${userId}, event=${eventType}, agent=${agentId}`);

  try {
    // Extiende según el tipo de agente
    const result = await orchestrateEvent({ userId, event: eventType, campaignId, agentId });
    res.status(200).json(result);
  } catch (err) {
    console.error('Agent orchestration failed', err);
    res.status(500).json({ error: 'Agent orchestration failed' });
  }
});

/**
 * @openapi
 * /api/agent/activities:
 *   get:
 *     summary: Obtiene las últimas 50 actividades del agente para el usuario autenticado
 *     tags:
 *       - Agent
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de actividades
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 activities:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *                       user_id:
 *                         type: string
 *                       event_type:
 *                         type: string
 *                       campaign_id:
 *                         type: string
 *                       message:
 *                         type: string
 *       400:
 *         description: userId requerido
 *       500:
 *         description: Error interno del servidor
 */
router.get('/activities', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }
  try {
    const { data, error } = await supabaseAdmin
      .from('agent_activities')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(50);
    if (error) return res.status(500).json({ error: 'Failed to fetch activities', details: error.message });
    res.json({ activities: data });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

export default router; 