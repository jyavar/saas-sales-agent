import request from 'supertest';
import express from 'express';
import agentRoutes from '../../src/routes/agentRoutes.js';
import app from '../../src/server.js';
import { supabaseAdmin } from '../../src/services/supabase.js';
import { getAgentConfig } from '../../src/ai/agents/config';
import { describe, it, expect, afterAll, vi } from 'vitest';
import { mockSupabaseService } from '../mocks/supabase.js';
import { mockResendService } from '../mocks/resend.js';

process.env.OPENAI_API_KEY = 'test-key';
process.env.OPENAI_ORG_ID = 'test-org';

vi.mock('../../src/services/emailService.js', () => ({
  sendCampaignEmail: vi.fn().mockResolvedValue(undefined)
}));
vi.mock('../../src/services/loggingService.js', () => ({
  logUserInteraction: vi.fn().mockResolvedValue(undefined)
}));
vi.mock('../../src/services/analyticsService.js', () => ({
  getUserBehaviorData: vi.fn().mockResolvedValue(undefined)
}));

vi.mock('../../src/utils/common/logger.js', () => import('../mocks/logger.js'));

vi.mock('openai', () => import('../mocks/openai.js'));

describe('POST /api/agent/orchestrate', () => {
  const app = express();
  app.use(express.json());
  app.use('/api/agent', agentRoutes);

  const userId = 'test_user_123';
  const eventType = 'CAMPAIGN_VIEWED';
  const campaignId = 'test_campaign_001';

  afterAll(async () => {
    // Limpia las actividades de test
    await supabaseAdmin.from('agent_activities').delete().eq('user_id', userId);
  });

  it('should return 400 if userId is missing', async () => {
    const res = await request(app)
      .post('/api/agent/orchestrate')
      .send({ eventType: 'CAMPAIGN_VIEWED', metadata: { campaignId: 'cmp_001' } });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid input');
  });

  it('should return 400 if eventType is missing', async () => {
    const res = await request(app)
      .post('/api/agent/orchestrate')
      .send({ userId: 'user_123', metadata: { campaignId: 'cmp_001' } });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid input');
  });

  it('should return 200 and call orchestrateEvent for valid input', async () => {
    const res = await request(app)
      .post('/api/agent/orchestrate')
      .send({ userId, eventType, metadata: { campaignId } });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Respuesta mockeada del agente');
  });

  it('POST /api/agent/orchestrate should persist activity and return message', async () => {
    const res = await request(app)
      .post('/api/agent/orchestrate')
      .send({ userId, eventType, metadata: { campaignId } })
      .expect(200);
    expect(res.body.message).toBeDefined();
    // Verifica persistencia
    const { data } = await supabaseAdmin
      .from('agent_activities')
      .select('*')
      .eq('user_id', userId)
      .eq('campaign_id', campaignId)
      .order('timestamp', { ascending: false })
      .limit(1);
    expect(Array.isArray(data)).toBe(true);
    expect(data && data.length).toBeGreaterThan(0);
    if (data) {
      expect(data[0].message).toBe('Respuesta mockeada del agente');
    }

    const response = await request(app)
      .get('/api/agent/activities?userId=test_user');

    console.log('DEBUG activities response body:', response.body);

    expect(response.status).toBe(200);
  });

  it('debe responder con el mensaje del agente de soporte', async () => {
    const supportPrompt = getAgentConfig('support').prompt;
    const res = await request(app)
      .post('/api/agent/orchestrate')
      .send({ userId: 'test_user', eventType: 'TEST', agentId: 'support' })
      .expect(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.agentId).toBe('support');
    expect(res.body.contextUsed.persona.name).toBe('SupportBot');
    expect(res.body.message).toBe('Respuesta mockeada del agente');
  });
});

describe('POST /api/agent/orchestrate - Agent Integration Test', () => {
  it('should persist activity and return message', async () => {
    const response = await request(app)
      .post('/api/agent/orchestrate')
      .send({
        userId: 'test_user_123',
        campaignId: 'test_campaign_001',
        agentId: 'support',
        eventType: 'TEST'
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBeDefined();

    const { data } = await import('../../src/services/supabase.js').then(supabase =>
      supabase.supabaseAdmin
        .from('agent_activities')
        .select('*')
        .eq('user_id', 'test_user_123')
        .eq('campaign_id', 'test_campaign_001')
        .order('created_at', { ascending: false })
        .limit(1)
    );

    // DEBUG - inspección del mock
    console.log('••• TEST DEBUG - data:', data);

    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0].message).toContain('Respuesta mockeada');
  });
}); 