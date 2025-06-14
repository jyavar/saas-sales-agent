import { stripeService } from '../stripe/stripeService';
import { githubService } from '../github/githubService';
import { emailService } from '../email/emailService';
import { logger } from '../utils/common/logger.js';

export type WebhookProvider = 'stripe' | 'github' | 'resend';

export interface WebhookResult {
  success: boolean;
  eventId?: string;
  message?: string;
  result?: any;
}

export class WebhookOrchestrator {
  /**
   * Orquesta el procesamiento de webhooks según el proveedor
   */
  async processWebhook(provider: WebhookProvider, req: any): Promise<WebhookResult> {
    try {
      switch (provider) {
        case 'stripe': {
          // Stripe espera signature y payload crudo
          const signature = req.headers['stripe-signature'];
          const payload = req.rawBody || JSON.stringify(req.body);
          const event = stripeService.constructWebhookEvent(payload, signature);
          // Aquí deberías enrutar el evento a tu lógica de negocio
          logger.info('[Webhook] Stripe event received', { type: event.type, id: event.id });
          return { success: true, eventId: event.id, message: 'Stripe event processed', result: event };
        }
        case 'github': {
          const eventType = req.headers['x-github-event'];
          const signature = req.headers['x-hub-signature-256'];
          const payloadRaw = req.rawBody || JSON.stringify(req.body);
          const result = await githubService.processWebhook(eventType, req.body, payloadRaw, signature);
          logger.info('[Webhook] GitHub event received', { type: eventType });
          return { success: true, message: 'GitHub event processed', result };
        }
        case 'resend': {
          // Resend no requiere firma, solo procesa el body
          // Aquí podrías enrutar a emailService o lógica de tracking
          logger.info('[Webhook] Resend event received', { type: req.body.type });
          return { success: true, message: 'Resend event processed', result: req.body };
        }
        default:
          logger.warn('[Webhook] Unknown provider', { provider });
          return { success: false, message: 'Unknown webhook provider' };
      }
    } catch (error: any) {
      logger.error('[Webhook] Processing failed', { provider, error: error.message });
      return { success: false, message: error.message };
    }
  }

  // TODO: Implementar colas, reintentos y alertas para fallos críticos
}

export const webhookOrchestrator = new WebhookOrchestrator(); 