import { analyzeRepo } from '../analyzer/analyzeRepo';
import { generateCampaign } from '../generator/generateCampaign';
import { dispatch } from '../dispatcher/dispatch';
import { RepoInput } from '../types';
import { Logger } from 'pino';
import { z } from 'zod';
import { campaignPresets } from '../config/presets';
import { salesPrompts } from '../ai/prompts/sales';

export const AgentInputSchema = z.object({
  campaignId: z.string(),
  repoUrl: z.string().url(),
  tenantId: z.string(),
  campaignName: z.string(),
  presetKey: z.string().optional(),
});

export const AgentOutputSchema = z.object({
  success: z.boolean(),
  campaignId: z.string(),
  analysis: z.any(),
  generated: z.any(),
  error: z.string().optional(),
});

export type AgentInput = z.infer<typeof AgentInputSchema>;
export type AgentOutput = z.infer<typeof AgentOutputSchema>;

/**
 * Ejecuta el pipeline del agente para una campaña.
 * @param input - Datos de entrada para el agente
 */
export async function runAgentForCampaign(input: AgentInput): Promise<AgentOutput> {
  const log = require('../lib/logger').logger.child({ campaignId: input.campaignId, tenant: input.tenantId });
  try {
    const parsed = AgentInputSchema.parse(input);
    log.info('🔍 Analizando repositorio...');
    const analysis = await analyzeRepo({ repoUrl: parsed.repoUrl, tenantId: parsed.tenantId }, log);
    log.info({ analysis }, '✅ Análisis completado');
    log.info('📝 Generando campaña...');
    const presetKey = (parsed.presetKey as keyof typeof campaignPresets) || 'sales';
    const generated = await generateCampaign(analysis, presetKey, log);
    log.info({ generated }, '✅ Campaña generada');
    return {
      success: true,
      campaignId: parsed.campaignId,
      analysis,
      generated,
    };
  } catch (err: any) {
    log.error({ err }, '❌ Error en runAgentForCampaign');
    return {
      success: false,
      campaignId: input.campaignId,
      analysis: null,
      generated: null,
      error: err.message || 'Unknown error',
    };
  }
}

export async function runAgentForRepo(input: RepoInput & { presetKey?: string }, log: Logger) {
  try {
    log.info('🔍 Analizando repositorio...');
    const analysis = await analyzeRepo(input, log);
    log.info({ analysis }, '✅ Análisis completado');

    log.info('📝 Generando campaña...');
    const presetKey = (input.presetKey as keyof typeof campaignPresets) || 'sales';
    const campaign = await generateCampaign(analysis, presetKey, log);
    log.info({ campaign }, '✅ Campaña generada');

    log.info('📤 Despachando campaña...');
    const dispatchResult = await dispatch(input.tenantId, campaign, log);
    log.info({ dispatchResult }, '✅ Campaña despachada');
  } catch (err) {
    log.error({ err }, '❌ Error en pipeline de repo');
    throw err;
  }
} 