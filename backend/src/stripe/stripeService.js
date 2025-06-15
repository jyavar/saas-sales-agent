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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeService = exports.StripeService = void 0;
const stripe_1 = __importDefault(require("stripe"));
const stripeConfig_1 = require("../config/stripeConfig");
class StripeService {
    constructor(apiKey, webhookSecret) {
        this.stripe = new stripe_1.default(apiKey, { apiVersion: '2023-08-16' });
        this.webhookSecret = webhookSecret;
    }
    /**
     * Valida y construye el evento de webhook recibido de Stripe
     */
    constructWebhookEvent(payload, signature) {
        try {
            return this.stripe.webhooks.constructEvent(payload, signature, this.webhookSecret);
        }
        catch (err) {
            // Logging centralizado
            console.error('[Stripe] Webhook signature verification failed:', err);
            throw new Error('Invalid Stripe webhook signature');
        }
    }
    /**
     * Crea una sesión de checkout para suscripción
     */
    createCheckoutSession(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.stripe.checkout.sessions.create({
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
            }
            catch (err) {
                console.error('[Stripe] Failed to create checkout session:', err);
                throw err;
            }
        });
    }
    /**
     * Obtiene información de suscripción
     */
    getSubscription(subscriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sub = yield this.stripe.subscriptions.retrieve(subscriptionId);
                return {
                    id: sub.id,
                    customerId: typeof sub.customer === 'string' ? sub.customer : sub.customer.id,
                    planId: typeof sub.items.data[0].price.id === 'string' ? sub.items.data[0].price.id : '',
                    status: sub.status,
                    currentPeriodEnd: sub.current_period_end,
                };
            }
            catch (err) {
                console.error('[Stripe] Failed to retrieve subscription:', err);
                throw err;
            }
        });
    }
    /**
     * Actualiza el plan de una suscripción
     */
    updateSubscriptionPlan(subscriptionId, newPlanId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sub = yield this.stripe.subscriptions.retrieve(subscriptionId);
                return yield this.stripe.subscriptions.update(subscriptionId, {
                    items: [{ id: sub.items.data[0].id, price: newPlanId }],
                    proration_behavior: 'create_prorations',
                });
            }
            catch (err) {
                console.error('[Stripe] Failed to update subscription plan:', err);
                throw err;
            }
        });
    }
    /**
     * Cancela una suscripción
     */
    cancelSubscription(subscriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.stripe.subscriptions.del(subscriptionId);
            }
            catch (err) {
                console.error('[Stripe] Failed to cancel subscription:', err);
                throw err;
            }
        });
    }
    /**
     * Lista los planes/productos disponibles
     */
    listPlans() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const prices = yield this.stripe.prices.list({ active: true, expand: ['data.product'] });
                return prices.data.map((price) => ({
                    id: price.id,
                    name: price.product.name,
                    price: typeof price.unit_amount === 'number' ? price.unit_amount / 100 : 0,
                    features: (price.product.metadata.features || '').split(',').map(f => f.trim()),
                }));
            }
            catch (err) {
                console.error('[Stripe] Failed to list plans:', err);
                throw err;
            }
        });
    }
}
exports.StripeService = StripeService;
exports.stripeService = new StripeService(stripeConfig_1.STRIPE_SECRET_KEY, stripeConfig_1.STRIPE_WEBHOOK_SECRET);
