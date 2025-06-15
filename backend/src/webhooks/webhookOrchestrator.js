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
exports.webhookOrchestrator = exports.WebhookOrchestrator = void 0;
const stripeService_1 = require("../stripe/stripeService");
const githubService_1 = require("../github/githubService");
const logger_js_1 = require("../utils/common/logger.js");
class WebhookOrchestrator {
    /**
     * Orquesta el procesamiento de webhooks según el proveedor
     */
    processWebhook(provider, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                switch (provider) {
                    case 'stripe': {
                        // Stripe espera signature y payload crudo
                        const signature = req.headers['stripe-signature'];
                        const payload = req.rawBody || JSON.stringify(req.body);
                        const event = stripeService_1.stripeService.constructWebhookEvent(payload, signature);
                        // Aquí deberías enrutar el evento a tu lógica de negocio
                        logger_js_1.logger.info('[Webhook] Stripe event received', { type: event.type, id: event.id });
                        return { success: true, eventId: event.id, message: 'Stripe event processed', result: event };
                    }
                    case 'github': {
                        const eventType = req.headers['x-github-event'];
                        const signature = req.headers['x-hub-signature-256'];
                        const payloadRaw = req.rawBody || JSON.stringify(req.body);
                        const result = yield githubService_1.githubService.processWebhook(eventType, req.body, payloadRaw, signature);
                        logger_js_1.logger.info('[Webhook] GitHub event received', { type: eventType });
                        return { success: true, message: 'GitHub event processed', result };
                    }
                    case 'resend': {
                        // Resend no requiere firma, solo procesa el body
                        // Aquí podrías enrutar a emailService o lógica de tracking
                        logger_js_1.logger.info('[Webhook] Resend event received', { type: req.body.type });
                        return { success: true, message: 'Resend event processed', result: req.body };
                    }
                    default:
                        logger_js_1.logger.warn('[Webhook] Unknown provider', { provider });
                        return { success: false, message: 'Unknown webhook provider' };
                }
            }
            catch (error) {
                logger_js_1.logger.error('[Webhook] Processing failed', { provider, error: error.message });
                return { success: false, message: error.message };
            }
        });
    }
}
exports.WebhookOrchestrator = WebhookOrchestrator;
exports.webhookOrchestrator = new WebhookOrchestrator();
