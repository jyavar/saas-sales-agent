import { z } from 'zod';
import OpenAI from 'openai';

// Validación de configuración
const openaiConfigSchema = z.object({
  OPENAI_API_KEY: z.string().min(10, 'OPENAI_API_KEY is required'),
  OPENAI_ORG_ID: z.string().optional(),
  OPENAI_DEFAULT_MODEL: z.string().default('gpt-3.5-turbo'),
});

const openaiConfig = openaiConfigSchema.parse({
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_ORG_ID: process.env.OPENAI_ORG_ID,
  OPENAI_DEFAULT_MODEL: process.env.OPENAI_DEFAULT_MODEL,
});

const openai = new OpenAI({
  apiKey: openaiConfig.OPENAI_API_KEY,
  organization: openaiConfig.OPENAI_ORG_ID,
});

export class OpenAIService {
  private defaultModel: string;

  constructor(defaultModel: string) {
    this.defaultModel = defaultModel;
  }

  /**
   * Chat completion (conversational LLM)
   */
  async chatCompletion(params: { messages: any[]; model?: string; [key: string]: any }) {
    try {
      const response = await openai.chat.completions.create({
        ...params,
        model: params.model || this.defaultModel,
        messages: params.messages,
      });
      return response;
    } catch (err) {
      console.error('[OpenAI] Chat completion error:', err);
      throw err;
    }
  }

  /**
   * Text completion (legacy)
   */
  async textCompletion(params: { prompt: string; model?: string; [key: string]: any }) {
    try {
      const response = await openai.completions.create({
        ...params,
        model: params.model || this.defaultModel,
        prompt: params.prompt,
      });
      return response;
    } catch (err) {
      console.error('[OpenAI] Text completion error:', err);
      throw err;
    }
  }

  /**
   * Embeddings
   */
  async createEmbedding(params: { input: string | string[]; model?: string; [key: string]: any }) {
    try {
      const response = await openai.embeddings.create({
        ...params,
        model: params.model || this.defaultModel,
        input: params.input,
      });
      return response;
    } catch (err) {
      console.error('[OpenAI] Embedding error:', err);
      throw err;
    }
  }

  /**
   * Genera un mensaje de agente usando systemPrompt y contexto
   */
  async generateAgentMessage({ systemPrompt, context }: { systemPrompt: string; context: any }) {
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: JSON.stringify(context) },
    ];
    const response = await this.chatCompletion({
      messages,
      model: this.defaultModel,
    });
    return response.choices?.[0]?.message?.content || '';
  }

  // TODO: Fallback a otros proveedores, cache, control de costos
}

export const openaiService = new OpenAIService(openaiConfig.OPENAI_DEFAULT_MODEL); 