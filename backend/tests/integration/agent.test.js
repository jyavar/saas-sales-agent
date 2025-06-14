import request from 'supertest';
import express from 'express';
import agentRoutes from '../../src/routes/agentRoutes.js';
import app from '../../src/server.js';
import { supabaseAdmin } from '../../src/services/supabase.js';

jest.mock('../../src/services/emailService.js', () => ({
  sendCampaignEmail: jest.fn().mockResolvedValue(undefined)
}));
jest.mock('../../src/services/loggingService.js', () => ({
  logUserInteraction: jest.fn().mockResolvedValue(undefined)
}));
jest.mock('../../src/services/analyticsService.js', () => ({
  getUserBehaviorData: jest.fn().mockResolvedValue(undefined)
}));

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
    expect(res.body.error).toBe('Missing required fields');
  });

  it('should return 400 if eventType is missing', async () => {
    const res = await request(app)
      .post('/api/agent/orchestrate')
      .send({ userId: 'user_123', metadata: { campaignId: 'cmp_001' } });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Missing required fields');
  });

  it('should return 200 and call orchestrateEvent for valid input', async () => {
    const res = await request(app)
      .post('/api/agent/orchestrate')
      .send({ userId, eventType, metadata: { campaignId } });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Orchestration complete');
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
    expect(data && data.length).toBeGreaterThan(0);
    expect(data[0].message).toBe(res.body.message);
  });
}); 