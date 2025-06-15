import { AnalyzerResult } from '../types';
import { Logger } from 'pino';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

if (!OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables');
}

/**
 * Llama a OpenAI GPT-4 para generar una campaña de ventas.
 * @param params.analysis - Análisis del producto
 * @param params.prompt - Prompt base para la generación
 * @param params.log - Logger opcional
 */
export async function callOpenAICampaign({ analysis, prompt, log }: {
  analysis: AnalyzerResult,
  prompt: string,
  log?: Logger
}): Promise<{ subject: string, body: string, cta: string, segment: string }> {
  const systemPrompt = `${prompt}\n\nAnálisis del producto: ${JSON.stringify(analysis)}\n\nDevuelve un JSON con subject, body, cta, segment.`;
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
        ],
        temperature: 0.7,
        max_tokens: 512,
      }),
    });
    const data = await response.json();
    log?.info({ data }, 'Respuesta cruda de OpenAI');
    if (!response.ok) {
      throw new Error(data.error?.message || 'Error en la API de OpenAI');
    }
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('No se recibió contenido de OpenAI');
    // Intentar parsear el JSON devuelto por el modelo
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (err) {
      log?.error({ content }, 'No se pudo parsear el JSON de OpenAI');
      throw new Error('Respuesta de OpenAI no es JSON válido');
    }
    return parsed;
  } catch (error: any) {
    log?.error({ error: error.message }, 'Error en callOpenAICampaign');
    throw error;
  }
} 