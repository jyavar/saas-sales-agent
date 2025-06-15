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
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
vitest_1.vi.mock('../../src/utils/common/logger', () => ({ logUserInteraction: vitest_1.vi.fn() }));
vitest_1.vi.mock('../../src/services/openaiService', () => ({ generateAgentMessage: vitest_1.vi.fn(() => __awaiter(void 0, void 0, void 0, function* () { return 'MOCK_RESPONSE'; })) }));
vitest_1.vi.mock('../../src/services/supabase.js', () => {
    return {
        supabaseAdmin: {
            from: () => ({
                select: () => ({
                    eq: () => ({
                        eq: () => ({
                            order: () => ({
                                limit: () => ({
                                    data: [
                                        {
                                            user_id: 'test_user_123',
                                            campaign_id: 'test_campaign_001',
                                            message: 'Respuesta mockeada del agente'
                                        }
                                    ],
                                    error: null
                                })
                            })
                        })
                    })
                })
            })
        }
    };
});
