import { describe, it, expect } from 'vitest';
import { analyzeRepo } from '../analyzer/analyzeRepo';
import { RepoInputSchema, AnalyzerResultSchema } from '../types';

describe('analyzeRepo', () => {
  it('debe devolver una estructura válida para un repo simulado', async () => {
    const input = RepoInputSchema.parse({
      repoUrl: 'https://github.com/strato-ai/backend',
      tenantId: 'demo-tenant',
    });

    const result = await analyzeRepo(input);
    const parsed = AnalyzerResultSchema.parse(result);

    expect(parsed.description).toBeDefined();
    expect(parsed.techStack.length).toBeGreaterThan(0);
  });

  it('lanza error con entrada inválida', async () => {
    await expect(analyzeRepo({ repoUrl: 'not-a-url', tenantId: '' })).rejects.toThrow();
  });
}); 