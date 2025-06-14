import { z } from 'zod';
import { Configuration, OpenAIApi, CreateChatCompletionRequest, CreateCompletionRequest, CreateEmbeddingRequest } from 'openai';

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

const configuration = new Configuration({
  apiKey: openaiConfig.OPENAI_API_KEY,
  organization: openaiConfig.OPENAI_ORG_ID,
});

const openai = new OpenAIApi(configuration);

export class OpenAIService {
  private defaultModel: string;

  constructor(defaultModel: string) {
    this.defaultModel = defaultModel;
  }

  /**
   * Chat completion (conversational LLM)
   */
  async chatCompletion(params: Omit<CreateChatCompletionRequest, 'model'> & { model?: string }) {
    try {
      const response = await openai.createChatCompletion({
        ...params,
        model: params.model || this.defaultModel,
      });
      return response.data;
    } catch (err) {
      console.error('[OpenAI] Chat completion error:', err);
      throw err;
    }
  }

  /**
   * Text completion (legacy)
   */
  async textCompletion(params: Omit<CreateCompletionRequest, 'model'> & { model?: string }) {
    try {
      const response = await openai.createCompletion({
        ...params,
        model: params.model || this.defaultModel,
      });
      return response.data;
    } catch (err) {
      console.error('[OpenAI] Text completion error:', err);
      throw err;
    }
  }

  /**
   * Embeddings
   */
  async createEmbedding(params: Omit<CreateEmbeddingRequest, 'model'> & { model?: string }) {
    try {
      const response = await openai.createEmbedding({
        ...params,
        model: params.model || this.defaultModel,
      });
      return response.data;
    } catch (err) {
      console.error('[OpenAI] Embedding error:', err);
      throw err;
    }
  }

  // TODO: Fallback a otros proveedores, cache, control de costos
}

export const openaiService = new OpenAIService(openaiConfig.OPENAI_DEFAULT_MODEL); 