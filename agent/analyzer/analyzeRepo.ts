// Análisis de repositorios con lógica basada en IA 

import { RepoInputSchema, AnalyzerResultSchema, AnalyzerResult, RepoInput } from '../types';
import { Logger } from 'pino';

export async function analyzeRepo(input: unknown, log?: Logger): Promise<AnalyzerResult> {
  let parsedInput: RepoInput;
  try {
    parsedInput = RepoInputSchema.parse(input);
    log?.debug({ input: parsedInput }, 'Input validado');
  } catch (e: any) {
    log?.warn({ err: e.errors }, '❗ Error de validación de entrada en analyzeRepo');
    throw e;
  }

  // Simulación de análisis (reemplazar por lógica real)
  const result = {
    techStack: ['TypeScript', 'Node.js', 'Zod'],
    description: `Repo analizado: ${parsedInput.repoUrl}`,
    opportunities: ['Automatización de campañas', 'Integración CI/CD'],
  };

  try {
    const validResult = AnalyzerResultSchema.parse(result);
    log?.debug({ result: validResult }, 'Resultado validado');
    return validResult;
  } catch (e: any) {
    log?.error({ err: e.errors }, '❌ Error de validación de salida en analyzeRepo');
    throw e;
  }
} 