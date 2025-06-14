import request from 'supertest';
import express from 'express';
import agentRoutes from '../../src/routes/agentRoutes.js';

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
      .send({ userId: 'user_123', eventType: 'CAMPAIGN_VIEWED', metadata: { campaignId: 'cmp_001' } });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Orchestration complete');
  });
}); 