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
exports.logUserInteraction = logUserInteraction;
/**
 * Simulates logging a user interaction.
 */
function logUserInteraction(userId, campaignId, message) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`[loggingService] Logging interaction for user ${userId}, campaign ${campaignId}: ${message}`);
        yield new Promise(resolve => setTimeout(resolve, 200));
        console.log(`[loggingService] Interaction logged for user ${userId}, campaign ${campaignId}`);
    });
}
