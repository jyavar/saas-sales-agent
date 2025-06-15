"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openaiService = exports.OpenAIService = void 0;
const zod_1 = require("zod");
const openai_1 = __importDefault(require("openai"));
// Validación de configuración
const openaiConfigSchema = zod_1.z.object({
    OPENAI_API_KEY: zod_1.z.string().min(10, 'OPENAI_API_KEY is required'),
    OPENAI_ORG_ID: zod_1.z.string().optional(),
    OPENAI_DEFAULT_MODEL: zod_1.z.string().default('gpt-3.5-turbo'),
});
const openaiConfig = openaiConfigSchema.parse({
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_ORG_ID: process.env.OPENAI_ORG_ID,
    OPENAI_DEFAULT_MODEL: process.env.OPENAI_DEFAULT_MODEL,
});
const openai = new openai_1.default({
    apiKey: openaiConfig.OPENAI_API_KEY,
    organization: openaiConfig.OPENAI_ORG_ID,
});
class OpenAIService {
    constructor(defaultModel) {
        this.defaultModel = defaultModel;
    }
    /**
     * Chat completion (conversational LLM)
     */
    chatCompletion(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield openai.chat.completions.create(Object.assign(Object.assign({}, params), { model: params.model || this.defaultModel, messages: params.messages }));
                return response;
            }
            catch (err) {
                console.error('[OpenAI] Chat completion error:', err);
                throw err;
            }
        });
    }
    /**
     * Text completion (legacy)
     */
    textCompletion(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield openai.completions.create(Object.assign(Object.assign({}, params), { model: params.model || this.defaultModel, prompt: params.prompt }));
                return response;
            }
            catch (err) {
                console.error('[OpenAI] Text completion error:', err);
                throw err;
            }
        });
    }
    /**
     * Embeddings
     */
    createEmbedding(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield openai.embeddings.create(Object.assign(Object.assign({}, params), { model: params.model || this.defaultModel, input: params.input }));
                return response;
            }
            catch (err) {
                console.error('[OpenAI] Embedding error:', err);
                throw err;
            }
        });
    }
    /**
     * Genera un mensaje de agente usando systemPrompt y contexto
     */
    generateAgentMessage(_a) {
        return __awaiter(this, arguments, void 0, function* ({ systemPrompt, context }) {
            var _b, _c, _d;
            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: JSON.stringify(context) },
            ];
            const response = yield this.chatCompletion({
                messages,
                model: this.defaultModel,
            });
            return ((_d = (_c = (_b = response.choices) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.content) || '';
        });
    }
}
exports.OpenAIService = OpenAIService;
exports.openaiService = new OpenAIService(openaiConfig.OPENAI_DEFAULT_MODEL);
