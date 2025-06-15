// Generación de campañas a partir de insights del analyzer 

import { CampaignOutputSchema, AnalyzerResult, CampaignOutput } from "../types";
import { Logger } from 'pino';
import { campaignPresets } from '../config/presets';
import { salesPrompts } from '../config/prompts/sales';
import { callOpenAICampaign } from '../../agent/ai/openaiService';

/**
 * Genera una campaña de ventas usando OpenAI GPT-4 a partir del análisis del producto y un preset dinámico.
 * @param analysis - Resultado del análisis del producto
 * @param presetKey - Tipo de campaña ('sales', 'support', 'onboarding', ...)
 * @param log - Logger opcional para trazabilidad
 * @returns Campaña generada y validada
 */
export async function generateCampaign(
  analysis: AnalyzerResult,
  presetKey: keyof typeof campaignPresets = 'sales',
  log?: Logger
): Promise<CampaignOutput> {
  try {
    log?.debug({ analysis, presetKey }, 'Input de generación validado');
    const preset = campaignPresets[presetKey];
    const prompt = salesPrompts[preset.promptKey]?.generateCampaign;
    if (!prompt) throw new Error(`Prompt no encontrado para presetKey: ${presetKey}`);
    const openAIResponse = await callOpenAICampaign({ analysis, prompt });
    log?.info({ openAIResponse }, 'Respuesta de OpenAI recibida');
    const validCampaign = CampaignOutputSchema.parse({ ...openAIResponse, cta: preset.cta, segment: preset.segment });
    log?.debug({ campaign: validCampaign }, 'Campaña validada');
    return validCampaign;
  } catch (e: any) {
    log?.error({ err: e.errors || e.message }, '❌ Error en generateCampaign');
    throw e;
  }
} 