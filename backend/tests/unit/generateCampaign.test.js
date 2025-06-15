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
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const generateCampaign_1 = require("../../../agent/generator/generateCampaign");
const openaiService = __importStar(require("../../../agent/ai/openaiService"));
const mockLogger = {
    info: vitest_1.vi.fn(),
    error: vitest_1.vi.fn(),
};
(0, vitest_1.describe)('generateCampaign', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)('should call OpenAI and return campaign object', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockResult = {
            subject: 'Test Subject',
            body: 'Test Body',
            cta: 'Test CTA',
            segment: 'developers',
        };
        vitest_1.vi.spyOn(openaiService, 'callOpenAICampaign').mockResolvedValue(mockResult);
        const result = yield (0, generateCampaign_1.generateCampaign)({ prompt: 'test' }, 'sales', mockLogger);
        (0, vitest_1.expect)(result).toMatchObject(mockResult);
        (0, vitest_1.expect)(openaiService.callOpenAICampaign).toHaveBeenCalled();
        (0, vitest_1.expect)(mockLogger.info).toHaveBeenCalledWith(vitest_1.expect.stringContaining('OpenAI'));
    }));
});
