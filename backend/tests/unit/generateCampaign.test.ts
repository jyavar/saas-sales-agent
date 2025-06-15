import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateCampaign } from '../../../agent/generator/generateCampaign';
import * as openaiService from '../../../agent/ai/openaiService';

const mockLogger = {
  info: vi.fn(),
  error: vi.fn(),
};

describe('generateCampaign', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call OpenAI and return campaign object', async () => {
    const mockResult = {
      subject: 'Test Subject',
      body: 'Test Body',
      cta: 'Test CTA',
      segment: 'developers',
    };
    vi.spyOn(openaiService, 'callOpenAICampaign').mockResolvedValue(mockResult);
    const result = await generateCampaign({ prompt: 'test' } as any, 'sales', mockLogger as any);
    expect(result).toMatchObject(mockResult);
    expect(openaiService.callOpenAICampaign).toHaveBeenCalled();
    expect(mockLogger.info).toHaveBeenCalledWith(expect.stringContaining('OpenAI'));
  });
}); 