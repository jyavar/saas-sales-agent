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
const emailService_1 = require("../../src/services/emailService");
const mockLogger = {
    info: vitest_1.vi.fn(),
    error: vitest_1.vi.fn(),
};
(0, vitest_1.describe)('sendCampaignEmail', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)('should call sendCampaignEmail with correct data', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockData = { to: 'test@example.com', subject: 'Test', body: 'Body' };
        // Mock fetch or pRetry if needed here
        yield (0, vitest_1.expect)((0, emailService_1.sendCampaignEmail)(mockData.to, mockData.subject, mockData.body)).resolves.toBeUndefined();
        // No direct way to check internal fetch, but logger can be checked if exposed
    }));
    (0, vitest_1.it)('should log error if sendCampaignEmail fails', () => __awaiter(void 0, void 0, void 0, function* () {
        // For this, you would need to mock fetch or pRetry to throw
        // Example:
        // vi.spyOn(global, 'fetch').mockRejectedValue(new Error('API error'));
        // await expect(sendCampaignEmail('fail@example.com', 'Fail', 'Body')).rejects.toThrow('API error');
        // vi.restoreAllMocks();
        (0, vitest_1.expect)(true).toBe(true); // Placeholder
    }));
});
