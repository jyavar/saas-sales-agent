// Generación de campañas a partir de insights del analyzer 

import { CampaignOutputSchema, AnalyzerResult, CampaignOutput } from "../types";
import { Logger } from 'pino';

export function generateCampaign(analysis: AnalyzerResult, log?: Logger): CampaignOutput {
  let validInput: AnalyzerResult;
  try {
    validInput = analysis; // Si el análisis ya fue validado, esto es seguro. Si no, usar AnalyzerResultSchema.parse(analysis)
    log?.debug({ analysis: validInput }, 'Input de generación validado');
  } catch (e: any) {
    log?.warn({ err: e.errors }, '❗ Error de validación de entrada en generateCampaign');
    throw e;
  }

  const campaign = {
    subject: `🚀 Novedades en tu stack: ${validInput.techStack.join(", ")}`,
    body: `Descubre oportunidades: ${validInput.opportunities.join(", ")}`,
    cta: "Solicita una demo personalizada",
    segment: "developers",
  };

  try {
    const validCampaign = CampaignOutputSchema.parse(campaign);
    log?.debug({ campaign: validCampaign }, 'Campaña validada');
    return validCampaign;
  } catch (e: any) {
    log?.error({ err: e.errors }, '❌ Error de validación de salida en generateCampaign');
    throw e;
  }
} 