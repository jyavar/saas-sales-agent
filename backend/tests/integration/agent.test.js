"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const agentRoutes_js_1 = __importDefault(require("../../src/routes/agentRoutes.js"));
const server_js_1 = __importDefault(require("../../src/server.js"));
const supabase_js_1 = require("../../src/services/supabase.js");
const config_1 = require("../../src/ai/agents/config");
const vitest_1 = require("vitest");
process.env.OPENAI_API_KEY = 'test-key';
process.env.OPENAI_ORG_ID = 'test-org';
vitest_1.vi.mock('../../src/services/emailService.js', () => ({
    sendCampaignEmail: vitest_1.vi.fn().mockResolvedValue(undefined)
}));
vitest_1.vi.mock('../../src/services/loggingService.js', () => ({
    logUserInteraction: vitest_1.vi.fn().mockResolvedValue(undefined)
}));
vitest_1.vi.mock('../../src/services/analyticsService.js', () => ({
    getUserBehaviorData: vitest_1.vi.fn().mockResolvedValue(undefined)
}));
vitest_1.vi.mock('../../src/utils/common/logger.js', () => Promise.resolve().then(() => __importStar(require('../mocks/logger.js'))));
vitest_1.vi.mock('openai', () => Promise.resolve().then(() => __importStar(require('../mocks/openai.js'))));
(0, vitest_1.describe)('POST /api/agent/orchestrate', () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use('/api/agent', agentRoutes_js_1.default);
    const userId = 'test_user_123';
    const eventType = 'CAMPAIGN_VIEWED';
    const campaignId = 'test_campaign_001';
    (0, vitest_1.afterAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        // Limpia las actividades de test
        yield supabase_js_1.supabaseAdmin.from('agent_activities').delete().eq('user_id', userId);
    }));
    (0, vitest_1.it)('should return 400 if userId is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .post('/api/agent/orchestrate')
            .send({ eventType: 'CAMPAIGN_VIEWED', metadata: { campaignId: 'cmp_001' } });
        (0, vitest_1.expect)(res.status).toBe(400);
        (0, vitest_1.expect)(res.body.error).toBe('Invalid input');
    }));
    (0, vitest_1.it)('should return 400 if eventType is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .post('/api/agent/orchestrate')
            .send({ userId: 'user_123', metadata: { campaignId: 'cmp_001' } });
        (0, vitest_1.expect)(res.status).toBe(400);
        (0, vitest_1.expect)(res.body.error).toBe('Invalid input');
    }));
    (0, vitest_1.it)('should return 200 and call orchestrateEvent for valid input', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .post('/api/agent/orchestrate')
            .send({ userId, eventType, metadata: { campaignId } });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body.message).toBe('Respuesta mockeada del agente');
    }));
    (0, vitest_1.it)('POST /api/agent/orchestrate should persist activity and return message', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .post('/api/agent/orchestrate')
            .send({ userId, eventType, metadata: { campaignId } })
            .expect(200);
        (0, vitest_1.expect)(res.body.message).toBeDefined();
        // Verifica persistencia
        const { data } = yield supabase_js_1.supabaseAdmin
            .from('agent_activities')
            .select('*')
            .eq('user_id', userId)
            .eq('campaign_id', campaignId)
            .order('timestamp', { ascending: false })
            .limit(1);
        (0, vitest_1.expect)(Array.isArray(data)).toBe(true);
        (0, vitest_1.expect)(data && data.length).toBeGreaterThan(0);
        if (data) {
            (0, vitest_1.expect)(data[0].message).toBe('Respuesta mockeada del agente');
        }
        const response = yield (0, supertest_1.default)(app)
            .get('/api/agent/activities?userId=test_user');
        console.log('DEBUG activities response body:', response.body);
        (0, vitest_1.expect)(response.status).toBe(200);
    }));
    (0, vitest_1.it)('debe responder con el mensaje del agente de soporte', () => __awaiter(void 0, void 0, void 0, function* () {
        const supportPrompt = (0, config_1.getAgentConfig)('support').prompt;
        const res = yield (0, supertest_1.default)(app)
            .post('/api/agent/orchestrate')
            .send({ userId: 'test_user', eventType: 'TEST', agentId: 'support' })
            .expect(200);
        (0, vitest_1.expect)(res.body).toHaveProperty('message');
        (0, vitest_1.expect)(res.body.agentId).toBe('support');
        (0, vitest_1.expect)(res.body.contextUsed.persona.name).toBe('SupportBot');
        (0, vitest_1.expect)(res.body.message).toBe('Respuesta mockeada del agente');
    }));
});
(0, vitest_1.describe)('POST /api/agent/orchestrate - Agent Integration Test', () => {
    (0, vitest_1.it)('should persist activity and return message', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_js_1.default)
            .post('/api/agent/orchestrate')
            .send({
            userId: 'test_user_123',
            campaignId: 'test_campaign_001',
            agentId: 'support',
            eventType: 'TEST'
        });
        (0, vitest_1.expect)(response.status).toBe(200);
        (0, vitest_1.expect)(response.body.message).toBeDefined();
        const { data } = yield Promise.resolve().then(() => __importStar(require('../../src/services/supabase.js'))).then(supabase => supabase.supabaseAdmin
            .from('agent_activities')
            .select('*')
            .eq('user_id', 'test_user_123')
            .eq('campaign_id', 'test_campaign_001')
            .order('created_at', { ascending: false })
            .limit(1));
        // DEBUG - inspección del mock
        console.log('••• TEST DEBUG - data:', data);
        (0, vitest_1.expect)(Array.isArray(data)).toBe(true);
        (0, vitest_1.expect)(data.length).toBeGreaterThan(0);
        (0, vitest_1.expect)(data[0].message).toContain('Respuesta mockeada');
    }));
});
