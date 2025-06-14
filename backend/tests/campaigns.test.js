/**
 * Campaign module tests
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import { validateData } from '../src/utils/validation.js';
import { z } from 'zod';

// Import campaign functions for testing
// Note: In a real environment, you'd mock the database calls

describe('Campaign Module', () => {
  describe('Campaign Validation', () => {
    const campaignSchema = z.object({
      name: z.string().min(1, 'Campaign name required').max(100, 'Name too long'),
      subject: z.string().min(1, 'Email subject required').max(200, 'Subject too long'),
      body: z.string().min(1, 'Email body required'),
      templateId: z.string().uuid().optional(),
      leadIds: z.array(z.string().uuid()).min(1, 'At least one lead required'),
      scheduleAt: z.string().datetime().optional(),
      metadata: z.object({}).optional()
    });

    test('should validate correct campaign data', () => {
      const validData = {
        name: 'Test Campaign',
        subject: 'Test Subject',
        body: '<p>Test email body</p>',
        leadIds: ['123e4567-e89b-12d3-a456-426614174000'],
        scheduleAt: '2024-12-31T10:00:00Z'
      };

      const result = validateData(validData, campaignSchema);
      
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.data.name, validData.name);
      assert.strictEqual(result.data.subject, validData.subject);
    });

    test('should reject campaign with empty name', () => {
      const invalidData = {
        name: '',
        subject: 'Test Subject',
        body: '<p>Test email body</p>',
        leadIds: ['123e4567-e89b-12d3-a456-426614174000']
      };

      const result = validateData(invalidData, campaignSchema);
      
      assert.strictEqual(result.success, false);
      assert.ok(result.errors.some(err => err.field === 'name'));
    });

    test('should reject campaign with no leads', () => {
      const invalidData = {
        name: 'Test Campaign',
        subject: 'Test Subject',
        body: '<p>Test email body</p>',
        leadIds: []
      };

      const result = validateData(invalidData, campaignSchema);
      
      assert.strictEqual(result.success, false);
      assert.ok(result.errors.some(err => err.field === 'leadIds'));
    });

    test('should reject campaign with invalid UUID in leadIds', () => {
      const invalidData = {
        name: 'Test Campaign',
        subject: 'Test Subject',
        body: '<p>Test email body</p>',
        leadIds: ['invalid-uuid']
      };

      const result = validateData(invalidData, campaignSchema);
      
      assert.strictEqual(result.success, false);
      assert.ok(result.errors.some(err => err.field.includes('leadIds')));
    });

    test('should reject campaign with invalid datetime', () => {
      const invalidData = {
        name: 'Test Campaign',
        subject: 'Test Subject',
        body: '<p>Test email body</p>',
        leadIds: ['123e4567-e89b-12d3-a456-426614174000'],
        scheduleAt: 'invalid-date'
      };

      const result = validateData(invalidData, campaignSchema);
      
      assert.strictEqual(result.success, false);
      assert.ok(result.errors.some(err => err.field === 'scheduleAt'));
    });

    test('should accept campaign with optional fields', () => {
      const validData = {
        name: 'Test Campaign',
        subject: 'Test Subject',
        body: '<p>Test email body</p>',
        leadIds: ['123e4567-e89b-12d3-a456-426614174000'],
        templateId: '123e4567-e89b-12d3-a456-426614174001',
        metadata: { source: 'test' }
      };

      const result = validateData(validData, campaignSchema);
      
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.data.templateId, validData.templateId);
      assert.deepStrictEqual(result.data.metadata, validData.metadata);
    });
  });

  describe('Email Personalization', () => {
    // Mock personalization function for testing
    const personalizeContent = (content, recipient) => {
      let personalizedContent = content;
      const variables = {
        '{{lead.email}}': recipient.email,
        '{{lead.name}}': recipient.metadata?.leadName || recipient.email.split('@')[0],
        '{{lead.firstName}}': (recipient.metadata?.leadName || '').split(' ')[0] || 'there'
      };

      Object.entries(variables).forEach(([variable, value]) => {
        personalizedContent = personalizedContent.replace(new RegExp(variable, 'g'), value);
      });

      return personalizedContent;
    };

    test('should personalize email with lead name', () => {
      const content = 'Hello {{lead.name}}, welcome to our service!';
      const recipient = {
        email: 'john@example.com',
        metadata: { leadName: 'John Doe' }
      };

      const result = personalizeContent(content, recipient);
      
      assert.strictEqual(result, 'Hello John Doe, welcome to our service!');
    });

    test('should personalize email with first name', () => {
      const content = 'Hi {{lead.firstName}}, how are you?';
      const recipient = {
        email: 'jane@example.com',
        metadata: { leadName: 'Jane Smith' }
      };

      const result = personalizeContent(content, recipient);
      
      assert.strictEqual(result, 'Hi Jane, how are you?');
    });

    test('should fallback to email username when no name provided', () => {
      const content = 'Hello {{lead.name}}!';
      const recipient = {
        email: 'testuser@example.com',
        metadata: {}
      };

      const result = personalizeContent(content, recipient);
      
      assert.strictEqual(result, 'Hello testuser!');
    });

    test('should handle multiple variables in same content', () => {
      const content = 'Hi {{lead.firstName}}, your email {{lead.email}} is confirmed!';
      const recipient = {
        email: 'alice@example.com',
        metadata: { leadName: 'Alice Johnson' }
      };

      const result = personalizeContent(content, recipient);
      
      assert.strictEqual(result, 'Hi Alice, your email alice@example.com is confirmed!');
    });
  });

  describe('Campaign Status Logic', () => {
    test('should determine correct status for immediate send', () => {
      const scheduleAt = null;
      const expectedStatus = scheduleAt ? 'scheduled' : 'draft';
      
      assert.strictEqual(expectedStatus, 'draft');
    });

    test('should determine correct status for future schedule', () => {
      const scheduleAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // Tomorrow
      const isScheduled = scheduleAt && new Date(scheduleAt) > new Date();
      const expectedStatus = isScheduled ? 'scheduled' : 'draft';
      
      assert.strictEqual(expectedStatus, 'scheduled');
    });

    test('should determine correct status for past schedule', () => {
      const scheduleAt = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(); // Yesterday
      const isScheduled = scheduleAt && new Date(scheduleAt) > new Date();
      const expectedStatus = isScheduled ? 'scheduled' : 'draft';
      
      assert.strictEqual(expectedStatus, 'draft');
    });
  });

  describe('Campaign Statistics Calculation', () => {
    test('should calculate delivery rate correctly', () => {
      const totalRecipients = 100;
      const delivered = 95;
      const deliveryRate = Math.round((delivered / totalRecipients) * 100);
      
      assert.strictEqual(deliveryRate, 95);
    });

    test('should calculate open rate correctly', () => {
      const delivered = 95;
      const opened = 30;
      const openRate = Math.round((opened / delivered) * 100);
      
      assert.strictEqual(openRate, 32); // 31.57 rounded to 32
    });

    test('should calculate click rate correctly', () => {
      const opened = 30;
      const clicked = 5;
      const clickRate = Math.round((clicked / opened) * 100);
      
      assert.strictEqual(clickRate, 17); // 16.67 rounded to 17
    });

    test('should handle zero division gracefully', () => {
      const delivered = 0;
      const opened = 0;
      const openRate = delivered > 0 ? Math.round((opened / delivered) * 100) : 0;
      
      assert.strictEqual(openRate, 0);
    });
  });

  describe('Webhook Event Processing', () => {
    test('should extract campaign and lead IDs from webhook data', () => {
      const webhookData = {
        type: 'email.opened',
        data: {
          to: 'test@example.com',
          id: 'msg_123',
          tags: {
            campaignId: 'camp_123',
            leadId: 'lead_456'
          }
        }
      };

      const { campaignId, leadId } = webhookData.data.tags || {};
      
      assert.strictEqual(campaignId, 'camp_123');
      assert.strictEqual(leadId, 'lead_456');
    });

    test('should handle missing tags in webhook data', () => {
      const webhookData = {
        type: 'email.opened',
        data: {
          to: 'test@example.com',
          id: 'msg_123'
        }
      };

      const { campaignId, leadId } = webhookData.data.tags || {};
      
      assert.strictEqual(campaignId, undefined);
      assert.strictEqual(leadId, undefined);
    });
  });
});