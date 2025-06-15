import { vi } from 'vitest';
vi.mock('../../src/utils/common/logger', () => ({ logUserInteraction: vi.fn() }));
vi.mock('../../src/services/openaiService', () => ({ generateAgentMessage: vi.fn(async () => 'MOCK_RESPONSE') }));
vi.mock('../../src/services/supabase.js', () => {
  return {
    supabaseAdmin: {
      from: () => ({
        select: () => ({
          eq: () => ({
            eq: () => ({
              order: () => ({
                limit: () => ({
                  data: [
                    {
                      user_id: 'test_user_123',
                      campaign_id: 'test_campaign_001',
                      message: 'Respuesta mockeada del agente'
                    }
                  ],
                  error: null
                })
              })
            })
          })
        })
      })
    }
  };
}); 