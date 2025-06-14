import Stripe from 'stripe';
import type { Buffer } from 'node:buffer';
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from '../config/stripeConfig';

/**
 * StripeService centraliza toda la lógica de integración con Stripe.
 * - Inicializa el cliente Stripe
 * - Valida webhooks
 * - Gestiona planes, suscripciones y pagos
 * - Centraliza manejo de errores y logging
 */

export interface StripePlan {
  id: string;
  name: string;
  price: number;
  features: string[];
}

export interface StripeSubscription {
  id: string;
  customerId: string;
  planId: string;
  status: string;
  currentPeriodEnd: number;
}

export class StripeService {
  private stripe: Stripe;
  private webhookSecret: string;

  constructor(apiKey: string, webhookSecret: string) {
    this.stripe = new Stripe(apiKey, { apiVersion: '2023-08-16' });
    this.webhookSecret = webhookSecret;
  }

  /**
   * Valida y construye el evento de webhook recibido de Stripe
   */
  public constructWebhookEvent(payload: Buffer | string, signature: string): Stripe.Event {
    try {
      return this.stripe.webhooks.constructEvent(payload, signature, this.webhookSecret);
    } catch (err) {
      // Logging centralizado
      console.error('[Stripe] Webhook signature verification failed:', err);
      throw new Error('Invalid Stripe webhook signature');
    }
  }

  /**
   * Crea una sesión de checkout para suscripción
   */
  public async createCheckoutSession(params: {
    customerEmail: string;
    planId: string;
    successUrl: string;
    cancelUrl: string;
    metadata?: Record<string, string>;
  }): Promise<Stripe.Checkout.Session> {
    try {
      return await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        customer_email: params.customerEmail,
        line_items: [
          {
            price: params.planId,
            quantity: 1,
          },
        ],
        success_url: params.successUrl,
        cancel_url: params.cancelUrl,
        metadata: params.metadata,
      });
    } catch (err) {
      console.error('[Stripe] Failed to create checkout session:', err);
      throw err;
    }
  }

  /**
   * Obtiene información de suscripción
   */
  public async getSubscription(subscriptionId: string): Promise<StripeSubscription> {
    try {
      const sub = await this.stripe.subscriptions.retrieve(subscriptionId);
      return {
        id: sub.id,
        customerId: typeof sub.customer === 'string' ? sub.customer : sub.customer.id,
        planId: typeof sub.items.data[0].price.id === 'string' ? sub.items.data[0].price.id : '',
        status: sub.status,
        currentPeriodEnd: sub.current_period_end,
      };
    } catch (err) {
      console.error('[Stripe] Failed to retrieve subscription:', err);
      throw err;
    }
  }

  /**
   * Actualiza el plan de una suscripción
   */
  public async updateSubscriptionPlan(subscriptionId: string, newPlanId: string): Promise<Stripe.Subscription> {
    try {
      const sub = await this.stripe.subscriptions.retrieve(subscriptionId);
      return await this.stripe.subscriptions.update(subscriptionId, {
        items: [{ id: sub.items.data[0].id, price: newPlanId }],
        proration_behavior: 'create_prorations',
      });
    } catch (err) {
      console.error('[Stripe] Failed to update subscription plan:', err);
      throw err;
    }
  }

  /**
   * Cancela una suscripción
   */
  public async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    try {
      return await this.stripe.subscriptions.del(subscriptionId);
    } catch (err) {
      console.error('[Stripe] Failed to cancel subscription:', err);
      throw err;
    }
  }

  /**
   * Lista los planes/productos disponibles
   */
  public async listPlans(): Promise<StripePlan[]> {
    try {
      const prices = await this.stripe.prices.list({ active: true, expand: ['data.product'] });
      return prices.data.map((price) => ({
        id: price.id,
        name: (price.product as Stripe.Product).name,
        price: typeof price.unit_amount === 'number' ? price.unit_amount / 100 : 0,
        features: ((price.product as Stripe.Product).metadata.features || '').split(',').map(f => f.trim()),
      }));
    } catch (err) {
      console.error('[Stripe] Failed to list plans:', err);
      throw err;
    }
  }
}

export const stripeService = new StripeService(STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET); 