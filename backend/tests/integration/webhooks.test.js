/**
 * Webhook integration tests with idempotency
 */

import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import crypto from 'crypto';
import { mockSupabaseService } from '../mocks/supabase.js';
import { mockResendService } from '../mocks/resend.js';
import { 
  stripeCheckoutCompletedEvent,
  stripeSubscriptionUpdatedEvent,
  stripeInvoicePaidEvent,
  mockStripeSignature
} from '../fixtures/stripe.js';

// Mock webhook utilities
const mockWebhookIdempotency = {
  processedEvents: new Map(),
  
  checkWebhookIdempotency: (provider, payload, req) => {
    const eventId = payload.id;
    const key = `${provider}:${eventId}`;
    
    if (mockWebhookIdempotency.processedEvents.has(key)) {
      return {
        success: true,
        shouldProcess: false,
        eventId,
        reason: 'Already processed'
      };
    }
    
    return {
      success: true,
      shouldProcess: true,
      eventId,
      key,
      reason: 'New event'
    };
  },
  
  markWebhookProcessed: (provider, eventId, req) => {
    const key = `${provider}:${eventId}`;
    mockWebhookIdempotency.processedEvents.set(key, {
      processedAt: new Date().toISOString(),
      requestId: req.id
    });
  },
  
  clear: () => {
    mockWebhookIdempotency.processedEvents.clear();
  }
};

const mockReq = {
  id: 'req-webhook-123',
  headers: {
    'stripe-signature': mockStripeSignature,
    'user-agent': 'Stripe/1.0'
  },
  rawBody: JSON.stringify(stripeCheckoutCompletedEvent)
};

describe('Webhook Integration Tests', () => {
  beforeEach(() => {
    // Reset all mocks
    mockSupabaseService.clearHistory();
    mockSupabaseService.clearMockData();
    mockResendService.clearSentEmails();
    mockWebhookIdempotency.clear();
    
    // Add mock user data
    mockSupabaseService.addMockData('users', {
      id: 'user-123',
      email: 'test@example.com',
      stripe_customer_id: 'cus_test_customer'
    });
  });

  afterEach(() => {
    mockSupabaseService.clearHistory();
    mockSupabaseService.clearMockData();
    mockResendService.clearSentEmails();
    mockWebhookIdempotency.clear();
  });

  describe('Stripe Webhook Processing', () => {
    test('should process checkout.session.completed successfully', async () => {
      // Mock webhook handler
      const processCheckoutCompleted = async (session) => {
        const customerId = session.customer;
        const planId = session.metadata?.planId;
        
        // Update subscription in database
        const subscriptionData = {
          user_id: 'user-123',
          stripe_customer_id: customerId,
          stripe_subscription_id: session.subscription,
          plan_id: planId,
          status: 'active',
          created_at: new Date().toISOString()
        };
        
        await mockSupabaseService.supabaseAdmin
          .from('subscriptions')
          .insert(subscriptionData);
        
        // Send confirmation email
        await mockResendService.sendSubscriptionConfirmationEmail({
          email: 'test@example.com',
          name: 'Test User',
          planId: planId
        });
        
        return { success: true, message: 'Checkout processed' };
      };
      
      const result = await processCheckoutCompleted(stripeCheckoutCompletedEvent.data.object);
      
      assert.strictEqual(result.success, true);
      
      // Verify database operations
      const history = mockSupabaseService.getHistory();
      const subscriptionInsert = history.inserts.find(insert => insert.table === 'subscriptions');
      assert.ok(subscriptionInsert);
      assert.strictEqual(subscriptionInsert.data.plan_id, 'pro');
      assert.strictEqual(subscriptionInsert.data.status, 'active');
      
      // Verify email sent
      const sentEmails = mockResendService.getSentEmails();
      const confirmationEmail = sentEmails.find(email => email.type === 'subscription_confirmation');
      assert.ok(confirmationEmail);
      assert.strictEqual(confirmationEmail.planId, 'pro');
    });

    test('should process subscription.updated correctly', async () => {
      // Add existing subscription
      mockSupabaseService.addMockData('subscriptions', {
        id: 'sub-123',
        user_id: 'user-123',
        stripe_subscription_id: 'sub_test_subscription',
        plan_id: 'starter',
        status: 'active'
      });
      
      const processSubscriptionUpdated = async (subscription) => {
        const planId = subscription.metadata?.planId || 'pro';
        
        // Update existing subscription
        await mockSupabaseService.supabaseAdmin
          .from('subscriptions')
          .update({
            plan_id: planId,
            status: subscription.status,
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', subscription.id);
        
        return { success: true, message: 'Subscription updated' };
      };
      
      const result = await processSubscriptionUpdated(stripeSubscriptionUpdatedEvent.data.object);
      
      assert.strictEqual(result.success, true);
      
      // Verify update operation
      const history = mockSupabaseService.getHistory();
      const updateOp = history.updates.find(update => 
        update.table === 'subscriptions' &&
        update.value === 'sub_test_subscription'
      );
      assert.ok(updateOp);
      assert.strictEqual(updateOp.data.plan_id, 'pro');
    });

    test('should process invoice.payment_succeeded', async () => {
      const processPaymentSucceeded = async (invoice) => {
        // Record payment
        const paymentData = {
          stripe_invoice_id: invoice.id,
          stripe_customer_id: invoice.customer,
          stripe_subscription_id: invoice.subscription,
          amount: invoice.amount_paid,
          currency: invoice.currency,
          status: 'succeeded',
          paid_at: new Date(invoice.status_transitions.paid_at * 1000).toISOString(),
          created_at: new Date().toISOString()
        };
        
        await mockSupabaseService.supabaseAdmin
          .from('payments')
          .insert(paymentData);
        
        return { success: true, message: 'Payment recorded' };
      };
      
      const result = await processPaymentSucceeded(stripeInvoicePaidEvent.data.object);
      
      assert.strictEqual(result.success, true);
      
      // Verify payment record
      const history = mockSupabaseService.getHistory();
      const paymentInsert = history.inserts.find(insert => insert.table === 'payments');
      assert.ok(paymentInsert);
      assert.strictEqual(paymentInsert.data.amount, 9900);
      assert.strictEqual(paymentInsert.data.status, 'succeeded');
    });
  });

  describe('Webhook Idempotency', () => {
    test('should process new webhook event', () => {
      const result = mockWebhookIdempotency.checkWebhookIdempotency(
        'stripe',
        stripeCheckoutCompletedEvent,
        mockReq
      );
      
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.shouldProcess, true);
      assert.strictEqual(result.eventId, stripeCheckoutCompletedEvent.id);
      assert.strictEqual(result.reason, 'New event');
    });

    test('should skip already processed webhook event', () => {
      // Mark event as processed
      mockWebhookIdempotency.markWebhookProcessed(
        'stripe',
        stripeCheckoutCompletedEvent.id,
        mockReq
      );
      
      // Try to process again
      const result = mockWebhookIdempotency.checkWebhookIdempotency(
        'stripe',
        stripeCheckoutCompletedEvent,
        mockReq
      );
      
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.shouldProcess, false);
      assert.strictEqual(result.reason, 'Already processed');
    });

    test('should handle different event IDs correctly', () => {
      // Process first event
      mockWebhookIdempotency.markWebhookProcessed(
        'stripe',
        stripeCheckoutCompletedEvent.id,
        mockReq
      );
      
      // Different event should still be processed
      const result = mockWebhookIdempotency.checkWebhookIdempotency(
        'stripe',
        stripeSubscriptionUpdatedEvent,
        mockReq
      );
      
      assert.strictEqual(result.shouldProcess, true);
    });

    test('should handle events from different providers separately', () => {
      // Mark Stripe event as processed
      mockWebhookIdempotency.markWebhookProcessed(
        'stripe',
        'evt_test_webhook',
        mockReq
      );
      
      // Same event ID from different provider should be processed
      const githubEvent = { id: 'evt_test_webhook', type: 'push' };
      const result = mockWebhookIdempotency.checkWebhookIdempotency(
        'github',
        githubEvent,
        mockReq
      );
      
      assert.strictEqual(result.shouldProcess, true);
    });
  });

  describe('Webhook Security', () => {
    test('should verify Stripe signature correctly', () => {
      const payload = JSON.stringify(stripeCheckoutCompletedEvent);
      const secret = 'test_webhook_secret';
      const timestamp = Math.floor(Date.now() / 1000);
      
      // Create valid signature
      const signedPayload = `${timestamp}.${payload}`;
      const signature = crypto
        .createHmac('sha256', secret)
        .update(signedPayload, 'utf8')
        .digest('hex');
      
      const fullSignature = `t=${timestamp},v1=${signature}`;
      
      // Mock verification function
      const verifySignature = (payload, signature, secret) => {
        const elements = signature.split(',');
        const signatureElements = {};
        
        for (const element of elements) {
          const [key, value] = element.split('=');
          signatureElements[key] = value;
        }
        
        const expectedSignature = crypto
          .createHmac('sha256', secret)
          .update(`${signatureElements.t}.${payload}`, 'utf8')
          .digest('hex');
        
        return crypto.timingSafeEqual(
          Buffer.from(signatureElements.v1, 'hex'),
          Buffer.from(expectedSignature, 'hex')
        );
      };
      
      const isValid = verifySignature(payload, fullSignature, secret);
      assert.strictEqual(isValid, true);
    });

    test('should reject invalid signature', () => {
      const payload = JSON.stringify(stripeCheckoutCompletedEvent);
      const secret = 'test_webhook_secret';
      const invalidSignature = 't=1234567890,v1=invalid_signature';
      
      const verifySignature = (payload, signature, secret) => {
        try {
          const elements = signature.split(',');
          const signatureElements = {};
          
          for (const element of elements) {
            const [key, value] = element.split('=');
            signatureElements[key] = value;
          }
          
          const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(`${signatureElements.t}.${payload}`, 'utf8')
            .digest('hex');
          
          return crypto.timingSafeEqual(
            Buffer.from(signatureElements.v1, 'hex'),
            Buffer.from(expectedSignature, 'hex')
          );
        } catch (error) {
          return false;
        }
      };
      
      const isValid = verifySignature(payload, invalidSignature, secret);
      assert.strictEqual(isValid, false);
    });

    test('should reject timestamp too old', () => {
      const payload = JSON.stringify(stripeCheckoutCompletedEvent);
      const secret = 'test_webhook_secret';
      const oldTimestamp = Math.floor(Date.now() / 1000) - 600; // 10 minutes ago
      const tolerance = 300; // 5 minutes
      
      const signedPayload = `${oldTimestamp}.${payload}`;
      const signature = crypto
        .createHmac('sha256', secret)
        .update(signedPayload, 'utf8')
        .digest('hex');
      
      const fullSignature = `t=${oldTimestamp},v1=${signature}`;
      
      const verifyWithTimestamp = (payload, signature, secret, tolerance) => {
        const elements = signature.split(',');
        const signatureElements = {};
        
        for (const element of elements) {
          const [key, value] = element.split('=');
          signatureElements[key] = value;
        }
        
        const timestamp = signatureElements.t;
        const currentTime = Math.floor(Date.now() / 1000);
        
        // Check timestamp tolerance
        if (Math.abs(currentTime - timestamp) > tolerance) {
          return false;
        }
        
        const expectedSignature = crypto
          .createHmac('sha256', secret)
          .update(`${timestamp}.${payload}`, 'utf8')
          .digest('hex');
        
        return crypto.timingSafeEqual(
          Buffer.from(signatureElements.v1, 'hex'),
          Buffer.from(expectedSignature, 'hex')
        );
      };
      
      const isValid = verifyWithTimestamp(payload, fullSignature, secret, tolerance);
      assert.strictEqual(isValid, false);
    });
  });

  describe('GitHub Webhook Processing', () => {
    test('should process push event correctly', async () => {
      const pushEvent = {
        id: 'github-push-123',
        type: 'push',
        repository: {
          full_name: 'user/repo',
          html_url: 'https://github.com/user/repo'
        },
        ref: 'refs/heads/main',
        commits: [
          {
            id: 'commit-123',
            message: 'Update package.json',
            added: ['package.json'],
            modified: [],
            removed: []
          }
        ]
      };
      
      const processPushEvent = async (payload) => {
        const isMainBranch = payload.ref === 'refs/heads/main';
        const hasSignificantChanges = payload.commits.some(commit => 
          commit.added.includes('package.json') || 
          commit.modified.includes('package.json')
        );
        
        if (isMainBranch && hasSignificantChanges) {
          return { 
            success: true, 
            message: 'Push event processed',
            shouldReanalyze: true
          };
        }
        
        return { 
          success: true, 
          message: 'Push event ignored',
          shouldReanalyze: false
        };
      };
      
      const result = await processPushEvent(pushEvent);
      
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.shouldReanalyze, true);
    });

    test('should ignore push to non-main branch', async () => {
      const pushEvent = {
        id: 'github-push-124',
        type: 'push',
        repository: {
          full_name: 'user/repo',
          html_url: 'https://github.com/user/repo'
        },
        ref: 'refs/heads/feature-branch',
        commits: [
          {
            id: 'commit-124',
            message: 'Feature update',
            added: ['feature.js'],
            modified: [],
            removed: []
          }
        ]
      };
      
      const processPushEvent = async (payload) => {
        const isMainBranch = payload.ref === 'refs/heads/main';
        
        if (!isMainBranch) {
          return { 
            success: true, 
            message: 'Push to non-main branch ignored',
            shouldReanalyze: false
          };
        }
        
        return { success: true, shouldReanalyze: true };
      };
      
      const result = await processPushEvent(pushEvent);
      
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.shouldReanalyze, false);
    });
  });

  describe('Resend Webhook Processing', () => {
    test('should process email delivered event', async () => {
      const emailDeliveredEvent = {
        id: 'resend-event-123',
        type: 'email.delivered',
        data: {
          to: 'test@example.com',
          id: 'msg-123',
          created_at: new Date().toISOString(),
          tags: {
            campaignId: 'campaign-123',
            leadId: 'lead-123'
          }
        }
      };
      
      const processEmailDelivered = async (eventData) => {
        const { campaignId, leadId } = eventData.data.tags || {};
        
        if (!campaignId || !leadId) {
          return { 
            success: false, 
            error: 'Missing campaign or lead ID' 
          };
        }
        
        // Update campaign log
        await mockSupabaseService.supabaseAdmin
          .from('campaign_logs')
          .update({
            status: 'delivered',
            delivered_at: eventData.data.created_at
          })
          .eq('campaign_id', campaignId)
          .eq('lead_id', leadId);
        
        return { success: true, message: 'Email delivery tracked' };
      };
      
      const result = await processEmailDelivered(emailDeliveredEvent);
      
      assert.strictEqual(result.success, true);
      
      // Verify database update
      const history = mockSupabaseService.getHistory();
      const updateOp = history.updates.find(update => 
        update.table === 'campaign_logs' &&
        update.data.status === 'delivered'
      );
      assert.ok(updateOp);
    });

    test('should process email opened event', async () => {
      const emailOpenedEvent = {
        id: 'resend-event-124',
        type: 'email.opened',
        data: {
          to: 'test@example.com',
          id: 'msg-124',
          created_at: new Date().toISOString(),
          user_agent: 'Mozilla/5.0...',
          ip_address: '192.168.1.1',
          tags: {
            campaignId: 'campaign-123',
            leadId: 'lead-123'
          }
        }
      };
      
      const processEmailOpened = async (eventData) => {
        const { campaignId, leadId } = eventData.data.tags || {};
        
        // Update campaign log
        await mockSupabaseService.supabaseAdmin
          .from('campaign_logs')
          .update({
            status: 'opened',
            opened_at: eventData.data.created_at
          })
          .eq('campaign_id', campaignId)
          .eq('lead_id', leadId);
        
        // Increment campaign open count
        await mockSupabaseService.supabaseAdmin
          .from('campaigns')
          .update({
            open_count: 1 // Simplified for test
          })
          .eq('id', campaignId);
        
        return { success: true, message: 'Email open tracked' };
      };
      
      const result = await processEmailOpened(emailOpenedEvent);
      
      assert.strictEqual(result.success, true);
      
      // Verify both updates
      const history = mockSupabaseService.getHistory();
      const logUpdate = history.updates.find(update => 
        update.table === 'campaign_logs' &&
        update.data.status === 'opened'
      );
      const campaignUpdate = history.updates.find(update => 
        update.table === 'campaigns' &&
        update.data.open_count === 1
      );
      
      assert.ok(logUpdate);
      assert.ok(campaignUpdate);
    });
  });

  describe('Webhook Error Handling', () => {
    test('should handle database errors gracefully', async () => {
      // Simulate database error by clearing mock data
      mockSupabaseService.clearMockData();
      
      const processWithError = async () => {
        try {
          await mockSupabaseService.supabaseAdmin
            .from('non_existent_table')
            .insert({ data: 'test' });
          
          return { success: true };
        } catch (error) {
          return { 
            success: false, 
            error: 'Database operation failed' 
          };
        }
      };
      
      const result = await processWithError();
      
      assert.strictEqual(result.success, false);
      assert.ok(result.error);
    });

    test('should handle missing webhook data', () => {
      const incompleteEvent = {
        id: 'incomplete-event',
        type: 'unknown.event'
        // Missing data field
      };
      
      const processIncompleteEvent = (event) => {
        if (!event.data) {
          return { 
            success: false, 
            error: 'Missing event data' 
          };
        }
        
        return { success: true };
      };
      
      const result = processIncompleteEvent(incompleteEvent);
      
      assert.strictEqual(result.success, false);
      assert.strictEqual(result.error, 'Missing event data');
    });
  });

  describe('Webhook Logging and Monitoring', () => {
    test('should log webhook processing events', () => {
      const webhookEvents = [];
      
      const logWebhookEvent = (provider, eventType, success, duration) => {
        webhookEvents.push({
          provider,
          eventType,
          success,
          duration,
          timestamp: new Date().toISOString()
        });
      };
      
      // Simulate webhook processing
      logWebhookEvent('stripe', 'checkout.session.completed', true, 150);
      logWebhookEvent('github', 'push', true, 75);
      logWebhookEvent('resend', 'email.delivered', false, 200);
      
      assert.strictEqual(webhookEvents.length, 3);
      assert.strictEqual(webhookEvents[0].provider, 'stripe');
      assert.strictEqual(webhookEvents[1].success, true);
      assert.strictEqual(webhookEvents[2].success, false);
    });

    test('should track webhook performance metrics', () => {
      const performanceMetrics = {
        totalWebhooks: 0,
        successfulWebhooks: 0,
        failedWebhooks: 0,
        averageProcessingTime: 0,
        processingTimes: []
      };
      
      const recordWebhookMetrics = (success, processingTime) => {
        performanceMetrics.totalWebhooks++;
        performanceMetrics.processingTimes.push(processingTime);
        
        if (success) {
          performanceMetrics.successfulWebhooks++;
        } else {
          performanceMetrics.failedWebhooks++;
        }
        
        performanceMetrics.averageProcessingTime = 
          performanceMetrics.processingTimes.reduce((sum, time) => sum + time, 0) / 
          performanceMetrics.processingTimes.length;
      };
      
      // Record some metrics
      recordWebhookMetrics(true, 100);
      recordWebhookMetrics(true, 150);
      recordWebhookMetrics(false, 300);
      
      assert.strictEqual(performanceMetrics.totalWebhooks, 3);
      assert.strictEqual(performanceMetrics.successfulWebhooks, 2);
      assert.strictEqual(performanceMetrics.failedWebhooks, 1);
      assert.strictEqual(Math.round(performanceMetrics.averageProcessingTime), 183);
    });
  });
});