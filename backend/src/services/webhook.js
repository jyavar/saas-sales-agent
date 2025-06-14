/**
 * Webhook processing service
 */

import crypto from 'crypto';
import { supabaseAdmin } from './supabase.js';
import { logger } from '../utils/common/logger.js';
import { ValidationError, UnauthorizedError } from '../utils/common/errorHandler.js';
import { githubService } from '../github/githubService';

export class WebhookService {
  /**
   * Process Stripe webhook
   */
  async processStripeWebhook(req) {
    try {
      // Verify webhook signature
      const signature = req.headers['stripe-signature'];
      const payload = req.rawBody || JSON.stringify(req.body);
      
      if (!this.verifyStripeSignature(payload, signature)) {
        throw new UnauthorizedError('Invalid webhook signature');
      }

      const event = req.body;
      
      // Check idempotency
      const isProcessed = await this.checkWebhookIdempotency('stripe', event.id, req);
      if (isProcessed) {
        return { success: true, eventId: event.id, message: 'Already processed' };
      }

      // Process event based on type
      let result;
      switch (event.type) {
        case 'checkout.session.completed':
          result = await this.handleCheckoutCompleted(event.data.object);
          break;
        case 'customer.subscription.updated':
          result = await this.handleSubscriptionUpdated(event.data.object);
          break;
        case 'invoice.payment_succeeded':
          result = await this.handlePaymentSucceeded(event.data.object);
          break;
        default:
          logger.info('Unhandled Stripe webhook event', {
            type: event.type,
            eventId: event.id,
            requestId: req.id
          });
          result = { success: true, message: 'Event ignored' };
      }

      // Mark as processed
      await this.markWebhookProcessed('stripe', event.id, req);

      return { success: true, eventId: event.id, result };
    } catch (error) {
      logger.error('Stripe webhook processing failed', {
        error: error.message,
        requestId: req.id
      });
      throw error;
    }
  }

  /**
   * Process Resend webhook
   */
  async processResendWebhook(req) {
    try {
      const event = req.body;
      
      // Check idempotency
      const isProcessed = await this.checkWebhookIdempotency('resend', event.id, req);
      if (isProcessed) {
        return { success: true, eventId: event.id, message: 'Already processed' };
      }

      // Process event based on type
      let result;
      switch (event.type) {
        case 'email.delivered':
          result = await this.handleEmailDelivered(event.data);
          break;
        case 'email.opened':
          result = await this.handleEmailOpened(event.data);
          break;
        case 'email.clicked':
          result = await this.handleEmailClicked(event.data);
          break;
        case 'email.bounced':
          result = await this.handleEmailBounced(event.data);
          break;
        default:
          logger.info('Unhandled Resend webhook event', {
            type: event.type,
            eventId: event.id,
            requestId: req.id
          });
          result = { success: true, message: 'Event ignored' };
      }

      // Mark as processed
      await this.markWebhookProcessed('resend', event.id, req);

      return { success: true, eventId: event.id, result };
    } catch (error) {
      logger.error('Resend webhook processing failed', {
        error: error.message,
        requestId: req.id
      });
      throw error;
    }
  }

  /**
   * Process GitHub webhook
   */
  async processGithubWebhook(req) {
    try {
      const eventType = req.headers['x-github-event'];
      const signature = req.headers['x-hub-signature-256'];
      const payloadRaw = req.rawBody || JSON.stringify(req.body);
      // Create event ID for GitHub (they don't provide one)
      const eventId = `github_${Date.now()}_${require('crypto').randomBytes(8).toString('hex')}`;
      // Check idempotency
      const isProcessed = await this.checkWebhookIdempotency('github', eventId, req);
      if (isProcessed) {
        return { success: true, eventId, message: 'Already processed' };
      }
      // Procesa el webhook usando el servicio centralizado
      const result = await githubService.processWebhook(eventType, req.body, payloadRaw, signature);
      // Mark as processed
      await this.markWebhookProcessed('github', eventId, req);
      return { success: true, eventId, result };
    } catch (error) {
      logger.error('GitHub webhook processing failed', {
        error: error.message,
        requestId: req.id
      });
      throw error;
    }
  }

  /**
   * Verify Stripe webhook signature
   */
  verifyStripeSignature(payload, signature) {
    try {
      const secret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!secret) {
        logger.warn('Stripe webhook secret not configured');
        return false;
      }

      const elements = signature.split(',');
      const signatureElements = {};
      
      for (const element of elements) {
        const [key, value] = element.split('=');
        signatureElements[key] = value;
      }

      const timestamp = signatureElements.t;
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${timestamp}.${payload}`, 'utf8')
        .digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(signatureElements.v1, 'hex'),
        Buffer.from(expectedSignature, 'hex')
      );
    } catch (error) {
      logger.error('Stripe signature verification failed', {
        error: error.message
      });
      return false;
    }
  }

  /**
   * Check webhook idempotency
   */
  async checkWebhookIdempotency(provider, eventId, req) {
    try {
      const { data, error } = await supabaseAdmin
        .from('webhook_logs')
        .select('id')
        .eq('provider', provider)
        .eq('event_id', eventId)
        .single();

      if (error && error.code !== 'PGRST116') {
        logger.error('Idempotency check failed', {
          error: error.message,
          provider,
          eventId,
          requestId: req.id
        });
      }

      return !!data;
    } catch (error) {
      logger.error('Idempotency check error', {
        error: error.message,
        provider,
        eventId,
        requestId: req.id
      });
      return false;
    }
  }

  /**
   * Mark webhook as processed
   */
  async markWebhookProcessed(provider, eventId, req) {
    try {
      await supabaseAdmin
        .from('webhook_logs')
        .insert({
          provider,
          event_id: eventId,
          event_type: req.body.type || 'unknown',
          status: 'completed',
          request_id: req.id,
          payload: req.body,
          processed_at: new Date().toISOString()
        });

      logger.debug('Webhook marked as processed', {
        provider,
        eventId,
        requestId: req.id
      });
    } catch (error) {
      logger.error('Failed to mark webhook as processed', {
        error: error.message,
        provider,
        eventId,
        requestId: req.id
      });
    }
  }

  /**
   * Handle Stripe checkout completed
   */
  async handleCheckoutCompleted(session) {
    try {
      // Extract customer and subscription info
      const customerId = session.customer;
      const subscriptionId = session.subscription;
      const planId = session.metadata?.planId || 'pro';

      // Update user subscription
      const { error } = await supabaseAdmin
        .from('subscriptions')
        .upsert({
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          plan_id: planId,
          status: 'active',
          updated_at: new Date().toISOString()
        });

      if (error) {
        throw error;
      }

      logger.info('Checkout completed processed', {
        customerId,
        subscriptionId,
        planId
      });

      return { success: true, message: 'Subscription activated' };
    } catch (error) {
      logger.error('Checkout completed processing failed', {
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Handle subscription updated
   */
  async handleSubscriptionUpdated(subscription) {
    try {
      const { error } = await supabaseAdmin
        .from('subscriptions')
        .update({
          status: subscription.status,
          plan_id: subscription.metadata?.planId || 'pro',
          updated_at: new Date().toISOString()
        })
        .eq('stripe_subscription_id', subscription.id);

      if (error) {
        throw error;
      }

      logger.info('Subscription updated processed', {
        subscriptionId: subscription.id,
        status: subscription.status
      });

      return { success: true, message: 'Subscription updated' };
    } catch (error) {
      logger.error('Subscription updated processing failed', {
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Handle payment succeeded
   */
  async handlePaymentSucceeded(invoice) {
    try {
      // Record payment
      const { error } = await supabaseAdmin
        .from('payments')
        .insert({
          stripe_invoice_id: invoice.id,
          stripe_customer_id: invoice.customer,
          stripe_subscription_id: invoice.subscription,
          amount: invoice.amount_paid,
          currency: invoice.currency,
          status: 'succeeded',
          paid_at: new Date(invoice.status_transitions.paid_at * 1000).toISOString()
        });

      if (error) {
        throw error;
      }

      logger.info('Payment succeeded processed', {
        invoiceId: invoice.id,
        amount: invoice.amount_paid,
        currency: invoice.currency
      });

      return { success: true, message: 'Payment recorded' };
    } catch (error) {
      logger.error('Payment succeeded processing failed', {
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Handle email delivered
   */
  async handleEmailDelivered(emailData) {
    try {
      const { campaignId, leadId } = emailData.tags || {};
      
      if (campaignId && leadId) {
        await supabaseAdmin
          .from('campaign_logs')
          .update({
            status: 'delivered',
            delivered_at: emailData.created_at
          })
          .eq('campaign_id', campaignId)
          .eq('lead_id', leadId);
      }

      return { success: true, message: 'Email delivery tracked' };
    } catch (error) {
      logger.error('Email delivered processing failed', {
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Handle email opened
   */
  async handleEmailOpened(emailData) {
    try {
      const { campaignId, leadId } = emailData.tags || {};
      
      if (campaignId && leadId) {
        // Update campaign log
        await supabaseAdmin
          .from('campaign_logs')
          .update({
            status: 'opened',
            opened_at: emailData.created_at
          })
          .eq('campaign_id', campaignId)
          .eq('lead_id', leadId);

        // Increment campaign open count
        await supabaseAdmin.rpc('increment_campaign_opens', {
          campaign_id: campaignId
        });
      }

      return { success: true, message: 'Email open tracked' };
    } catch (error) {
      logger.error('Email opened processing failed', {
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Handle email clicked
   */
  async handleEmailClicked(emailData) {
    try {
      const { campaignId, leadId } = emailData.tags || {};
      
      if (campaignId && leadId) {
        // Update campaign log
        await supabaseAdmin
          .from('campaign_logs')
          .update({
            status: 'clicked',
            clicked_at: emailData.created_at
          })
          .eq('campaign_id', campaignId)
          .eq('lead_id', leadId);

        // Increment campaign click count
        await supabaseAdmin.rpc('increment_campaign_clicks', {
          campaign_id: campaignId
        });
      }

      return { success: true, message: 'Email click tracked' };
    } catch (error) {
      logger.error('Email clicked processing failed', {
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Handle email bounced
   */
  async handleEmailBounced(emailData) {
    try {
      const { campaignId, leadId } = emailData.tags || {};
      
      if (campaignId && leadId) {
        await supabaseAdmin
          .from('campaign_logs')
          .update({
            status: 'bounced',
            error: emailData.reason || 'Email bounced'
          })
          .eq('campaign_id', campaignId)
          .eq('lead_id', leadId);
      }

      return { success: true, message: 'Email bounce tracked' };
    } catch (error) {
      logger.error('Email bounced processing failed', {
        error: error.message
      });
      throw error;
    }
  }
}

export const webhookService = new WebhookService();
export default webhookService;