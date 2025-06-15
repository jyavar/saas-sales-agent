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
const server_js_1 = __importDefault(require("../../src/server.js"));
const vitest_1 = require("vitest");
vitest_1.vi.mock('../../../agent/ai/openaiService', () => ({
    callOpenAICampaign: vitest_1.vi.fn().mockResolvedValue({
        subject: 'Test Subject',
        body: 'Test Body',
        cta: 'Test CTA',
        segment: 'developers',
    })
}));
vitest_1.vi.mock('../../src/services/emailService', () => ({
    sendCampaignEmail: vitest_1.vi.fn().mockResolvedValue(undefined)
}));
vitest_1.vi.mock('../../src/services/supabase.js', () => ({
    supabaseAdmin: {
        from: () => ({
            insert: () => ({ select: () => ({ single: () => ({ data: { id: 'mock-campaign-id' }, error: null }) }) }),
            select: () => ({ eq: () => ({ order: () => ({ limit: () => ({ data: [{ id: 'mock-campaign-id', message: 'Test Body' }], error: null }) }) }) })
        })
    }
}));
(0, vitest_1.describe)('E2E: Agent pipeline', () => {
    (0, vitest_1.it)('crea campaña y ejecuta pipeline completo', () => __awaiter(void 0, void 0, void 0, function* () {
        const payload = {
            name: 'Test Campaign',
            repoUrl: 'https://github.com/test/repo',
            tenantId: 'tenant-1',
            presetKey: 'sales',
        };
        const res = yield (0, supertest_1.default)(server_js_1.default)
            .post('/api/campaigns')
            .send(payload);
        (0, vitest_1.expect)(res.status).toBe(201);
        (0, vitest_1.expect)(res.body.campaign).toBeDefined();
        (0, vitest_1.expect)(res.body.agentResult.subject).toBe('Test Subject');
        // Verifica que se llamó a OpenAI y Resend
        const { callOpenAICampaign } = yield Promise.resolve().then(() => __importStar(require('../../../agent/ai/openaiService')));
        const { sendCampaignEmail } = yield Promise.resolve().then(() => __importStar(require('../../src/services/emailService')));
        (0, vitest_1.expect)(callOpenAICampaign).toHaveBeenCalled();
        (0, vitest_1.expect)(sendCampaignEmail).toHaveBeenCalled();
        // Verifica persistencia mock Supabase
        const { supabaseAdmin } = yield Promise.resolve().then(() => __importStar(require('../../src/services/supabase.js')));
        const { data } = yield supabaseAdmin.from('campaigns').select('*').eq('id', res.body.campaign.id);
        (0, vitest_1.expect)(Array.isArray(data)).toBe(true);
        (0, vitest_1.expect)(data.length).toBeGreaterThan(0);
    }));
});
