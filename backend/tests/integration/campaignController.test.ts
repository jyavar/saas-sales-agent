import request from 'supertest';
import app from '../../src/server.js';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import * as supabaseService from '../../src/services/supabase.js';
import * as agent from '../../../agent/generator/generateCampaign';

describe('POST /api/campaigns', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a campaign and trigger agent', async () => {
    vi.spyOn(supabaseService, 'insertCampaign').mockResolvedValue({ id: 'mock-campaign-id' });
    vi.spyOn(agent, 'generateCampaign').mockResolvedValue({ subject: 'Test', body: 'Body', cta: 'CTA', segment: 'seg' });
    const payload = {
      name: 'Test Campaign',
      subject: 'Test',
      body: 'Body',
      leadIds: ['123e4567-e89b-12d3-a456-426614174000'],
    };
    const res = await request(app).post('/api/campaigns').send(payload);
    expect(res.status).toBe(201);
    expect(res.body.campaign.id).toBe('mock-campaign-id');
    expect(agent.generateCampaign).toHaveBeenCalled();
    expect(supabaseService.insertCampaign).toHaveBeenCalled();
  });
}); 