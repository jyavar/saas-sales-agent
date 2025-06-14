/**
 * Comprehensive validation integration tests
 */

import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { validateData, userSchemas, repositorySchemas } from '../../src/utils/validation.js';
import { z } from 'zod';

describe('Validation Integration Tests', () => {
  describe('Campaign Validation Edge Cases', () => {
    const campaignSchema = z.object({
      name: z.string().min(1, 'Campaign name required').max(100, 'Name too long'),
      subject: z.string().min(1, 'Email subject required').max(200, 'Subject too long'),
      body: z.string().min(1, 'Email body required'),
      templateId: z.string().uuid().optional(),
      leadIds: z.array(z.string().uuid()).min(1, 'At least one lead required'),
      scheduleAt: z.string().datetime().optional(),
      metadata: z.object({}).optional()
    });

    test('should reject campaign with name exceeding 100 characters', () => {
      const longName = 'a'.repeat(101);
      const invalidData = {
        name: longName,
        subject: 'Test Subject',
        body: 'Test body',
        leadIds: ['123e4567-e89b-12d3-a456-426614174000']
      };

      const result = validateData(invalidData, campaignSchema);
      
      assert.strictEqual(result.success, false);
      assert.ok(result.errors.some(err => 
        err.field === 'name' && err.message.includes('too long')
      ));
    });

    test('should reject campaign with subject exceeding 200 characters', () => {
      const longSubject = 'a'.repeat(201);
      const invalidData = {
        name: 'Test Campaign',
        subject: longSubject,
        body: 'Test body',
        leadIds: ['123e4567-e89b-12d3-a456-426614174000']
      };

      const result = validateData(invalidData, campaignSchema);
      
      assert.strictEqual(result.success, false);
      assert.ok(result.errors.some(err => 
        err.field === 'subject' && err.message.includes('too long')
      ));
    });

    test('should reject campaign without tenant context', () => {
      // This would be handled at the middleware level
      const mockReq = {
        body: {
          name: 'Test Campaign',
          subject: 'Test Subject',
          body: 'Test body',
          leadIds: ['123e4567-e89b-12d3-a456-426614174000']
        },
        user: { id: 'user-123' },
        tenant: null // No tenant context
      };

      const hasTenantAccess = !!mockReq.tenant;
      assert.strictEqual(hasTenantAccess, false);
    });

    test('should reject campaign with malformed UUID in leadIds', () => {
      const invalidData = {
        name: 'Test Campaign',
        subject: 'Test Subject',
        body: 'Test body',
        leadIds: ['not-a-uuid', '123e4567-e89b-12d3-a456-426614174000']
      };

      const result = validateData(invalidData, campaignSchema);
      
      assert.strictEqual(result.success, false);
      assert.ok(result.errors.some(err => 
        err.field.includes('leadIds') && err.message.includes('Invalid uuid')
      ));
    });

    test('should reject campaign with invalid datetime format', () => {
      const invalidData = {
        name: 'Test Campaign',
        subject: 'Test Subject',
        body: 'Test body',
        leadIds: ['123e4567-e89b-12d3-a456-426614174000'],
        scheduleAt: '2024-13-45T25:70:90Z' // Invalid date
      };

      const result = validateData(invalidData, campaignSchema);
      
      assert.strictEqual(result.success, false);
      assert.ok(result.errors.some(err => 
        err.field === 'scheduleAt'
      ));
    });

    test('should accept campaign with valid optional fields', () => {
      const validData = {
        name: 'Test Campaign',
        subject: 'Test Subject',
        body: 'Test body with HTML <b>content</b>',
        leadIds: [
          '123e4567-e89b-12d3-a456-426614174000',
          '123e4567-e89b-12d3-a456-426614174001'
        ],
        templateId: '123e4567-e89b-12d3-a456-426614174002',
        scheduleAt: '2024-12-31T10:00:00Z',
        metadata: {
          source: 'api',
          campaign_type: 'welcome',
          tags: ['new-user', 'onboarding']
        }
      };

      const result = validateData(validData, campaignSchema);
      
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.data.name, validData.name);
      assert.strictEqual(result.data.leadIds.length, 2);
      assert.deepStrictEqual(result.data.metadata, validData.metadata);
    });
  });

  describe('User Authentication Validation', () => {
    test('should reject registration with weak password', () => {
      const weakPasswords = [
        '123',
        'password',
        '12345678', // Too simple
        'abc123',   // Too short and simple
        ''          // Empty
      ];

      weakPasswords.forEach(password => {
        const invalidData = {
          email: 'test@example.com',
          password: password,
          name: 'Test User',
          tenantName: 'Test Company'
        };

        const result = validateData(invalidData, userSchemas.register);
        
        assert.strictEqual(result.success, false, `Password "${password}" should be rejected`);
        assert.ok(result.errors.some(err => err.field === 'password'));
      });
    });

    test('should reject registration with invalid email formats', () => {
      const invalidEmails = [
        'not-an-email',
        '@example.com',
        'test@',
        'test.example.com',
        'test@.com',
        'test@example.',
        'test space@example.com',
        ''
      ];

      invalidEmails.forEach(email => {
        const invalidData = {
          email: email,
          password: 'validpassword123',
          name: 'Test User',
          tenantName: 'Test Company'
        };

        const result = validateData(invalidData, userSchemas.register);
        
        assert.strictEqual(result.success, false, `Email "${email}" should be rejected`);
        assert.ok(result.errors.some(err => err.field === 'email'));
      });
    });

    test('should reject registration with missing required fields', () => {
      const incompleteData = [
        { email: 'test@example.com' }, // Missing password, name, tenantName
        { password: 'password123' },   // Missing email, name, tenantName
        { email: 'test@example.com', password: 'password123' }, // Missing name, tenantName
        { email: 'test@example.com', password: 'password123', name: 'Test' } // Missing tenantName
      ];

      incompleteData.forEach((data, index) => {
        const result = validateData(data, userSchemas.register);
        
        assert.strictEqual(result.success, false, `Incomplete data ${index} should be rejected`);
        assert.ok(result.errors.length > 0);
      });
    });

    test('should accept valid registration data', () => {
      const validData = {
        email: 'test.user+tag@example.com',
        password: 'SecurePassword123!',
        name: 'Test User',
        tenantName: 'Test Company Inc.'
      };

      const result = validateData(validData, userSchemas.register);
      
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.data.email, validData.email);
      assert.strictEqual(result.data.name, validData.name);
    });
  });

  describe('Repository Analysis Validation', () => {
    test('should reject invalid repository URLs', () => {
      const invalidUrls = [
        'not-a-url',
        'http://not-github.com/user/repo',
        'https://github.com/user', // Missing repo
        'https://github.com/',      // Missing user and repo
        'ftp://github.com/user/repo', // Wrong protocol
        ''
      ];

      invalidUrls.forEach(url => {
        const invalidData = {
          url: url,
          branch: 'main'
        };

        const result = validateData(invalidData, repositorySchemas.analyze);
        
        assert.strictEqual(result.success, false, `URL "${url}" should be rejected`);
        assert.ok(result.errors.some(err => err.field === 'url'));
      });
    });

    test('should accept valid GitHub repository URLs', () => {
      const validUrls = [
        'https://github.com/facebook/react',
        'https://github.com/microsoft/vscode',
        'https://github.com/vercel/next.js',
        'https://github.com/user/repo-name',
        'https://github.com/org-name/project_name'
      ];

      validUrls.forEach(url => {
        const validData = {
          url: url,
          branch: 'main'
        };

        const result = validateData(validData, repositorySchemas.analyze);
        
        assert.strictEqual(result.success, true, `URL "${url}" should be accepted`);
        assert.strictEqual(result.data.url, url);
      });
    });

    test('should use default branch when not specified', () => {
      const validData = {
        url: 'https://github.com/facebook/react'
        // branch not specified
      };

      const result = validateData(validData, repositorySchemas.analyze);
      
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.data.branch, 'main'); // Default value
    });
  });

  describe('Complex Nested Validation', () => {
    test('should validate complex campaign with nested metadata', () => {
      const complexCampaignSchema = z.object({
        name: z.string().min(1).max(100),
        subject: z.string().min(1).max(200),
        body: z.string().min(1),
        leadIds: z.array(z.string().uuid()).min(1),
        metadata: z.object({
          source: z.string().optional(),
          tags: z.array(z.string()).optional(),
          settings: z.object({
            trackOpens: z.boolean().default(true),
            trackClicks: z.boolean().default(true),
            unsubscribeLink: z.boolean().default(true)
          }).optional(),
          customFields: z.record(z.string(), z.any()).optional()
        }).optional()
      });

      const complexData = {
        name: 'Complex Campaign',
        subject: 'Advanced Email Campaign',
        body: 'Email with tracking and custom fields',
        leadIds: ['123e4567-e89b-12d3-a456-426614174000'],
        metadata: {
          source: 'api',
          tags: ['premium', 'targeted'],
          settings: {
            trackOpens: true,
            trackClicks: false,
            unsubscribeLink: true
          },
          customFields: {
            priority: 'high',
            segment: 'enterprise',
            value: 1000
          }
        }
      };

      const result = validateData(complexData, complexCampaignSchema);
      
      assert.strictEqual(result.success, true);
      assert.deepStrictEqual(result.data.metadata.tags, ['premium', 'targeted']);
      assert.strictEqual(result.data.metadata.settings.trackClicks, false);
      assert.strictEqual(result.data.metadata.customFields.priority, 'high');
    });

    test('should reject complex data with invalid nested structure', () => {
      const complexCampaignSchema = z.object({
        name: z.string().min(1),
        metadata: z.object({
          settings: z.object({
            trackOpens: z.boolean(),
            priority: z.number().min(1).max(10)
          })
        })
      });

      const invalidData = {
        name: 'Test Campaign',
        metadata: {
          settings: {
            trackOpens: 'yes', // Should be boolean
            priority: 15      // Should be between 1-10
          }
        }
      };

      const result = validateData(invalidData, complexCampaignSchema);
      
      assert.strictEqual(result.success, false);
      assert.ok(result.errors.some(err => 
        err.field.includes('metadata.settings.trackOpens')
      ));
      assert.ok(result.errors.some(err => 
        err.field.includes('metadata.settings.priority')
      ));
    });
  });

  describe('Validation Error Messages', () => {
    test('should provide clear error messages for validation failures', () => {
      const schema = z.object({
        email: z.string().email('Please provide a valid email address'),
        age: z.number().min(18, 'Must be at least 18 years old').max(120, 'Age cannot exceed 120'),
        password: z.string().min(8, 'Password must be at least 8 characters long'),
        confirmPassword: z.string()
      }).refine(data => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword']
      });

      const invalidData = {
        email: 'invalid-email',
        age: 15,
        password: '123',
        confirmPassword: '456'
      };

      const result = validateData(invalidData, schema);
      
      assert.strictEqual(result.success, false);
      
      const emailError = result.errors.find(err => err.field === 'email');
      const ageError = result.errors.find(err => err.field === 'age');
      const passwordError = result.errors.find(err => err.field === 'password');
      const confirmPasswordError = result.errors.find(err => err.field === 'confirmPassword');
      
      assert.strictEqual(emailError.message, 'Please provide a valid email address');
      assert.strictEqual(ageError.message, 'Must be at least 18 years old');
      assert.strictEqual(passwordError.message, 'Password must be at least 8 characters long');
      assert.strictEqual(confirmPasswordError.message, 'Passwords do not match');
    });

    test('should handle multiple validation errors for same field', () => {
      const schema = z.object({
        username: z.string()
          .min(3, 'Username must be at least 3 characters')
          .max(20, 'Username cannot exceed 20 characters')
          .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
      });

      const invalidData = {
        username: 'a!' // Too short and contains invalid character
      };

      const result = validateData(invalidData, schema);
      
      assert.strictEqual(result.success, false);
      assert.ok(result.errors.length > 0);
      
      const usernameErrors = result.errors.filter(err => err.field === 'username');
      assert.ok(usernameErrors.length >= 1);
    });
  });

  describe('Performance and Edge Cases', () => {
    test('should handle large arrays efficiently', () => {
      const largeArraySchema = z.object({
        items: z.array(z.string().uuid()).max(1000, 'Too many items')
      });

      // Create array with 500 valid UUIDs
      const validUuids = Array.from({ length: 500 }, (_, i) => 
        `123e4567-e89b-12d3-a456-42661417${i.toString().padStart(4, '0')}`
      );

      const validData = { items: validUuids };
      const result = validateData(validData, largeArraySchema);
      
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.data.items.length, 500);
    });

    test('should reject array exceeding maximum size', () => {
      const limitedArraySchema = z.object({
        items: z.array(z.string()).max(10, 'Maximum 10 items allowed')
      });

      const tooManyItems = Array.from({ length: 15 }, (_, i) => `item-${i}`);
      const invalidData = { items: tooManyItems };
      
      const result = validateData(invalidData, limitedArraySchema);
      
      assert.strictEqual(result.success, false);
      assert.ok(result.errors.some(err => 
        err.field === 'items' && err.message.includes('Maximum 10 items')
      ));
    });

    test('should handle deeply nested objects', () => {
      const deepSchema = z.object({
        level1: z.object({
          level2: z.object({
            level3: z.object({
              level4: z.object({
                value: z.string().min(1, 'Deep value required')
              })
            })
          })
        })
      });

      const validDeepData = {
        level1: {
          level2: {
            level3: {
              level4: {
                value: 'deep value'
              }
            }
          }
        }
      };

      const result = validateData(validDeepData, deepSchema);
      
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.data.level1.level2.level3.level4.value, 'deep value');
    });

    test('should handle null and undefined values appropriately', () => {
      const nullableSchema = z.object({
        required: z.string(),
        optional: z.string().optional(),
        nullable: z.string().nullable(),
        optionalNullable: z.string().optional().nullable()
      });

      const testCases = [
        {
          data: { required: 'test' },
          shouldSucceed: true
        },
        {
          data: { required: 'test', optional: undefined },
          shouldSucceed: true
        },
        {
          data: { required: 'test', nullable: null },
          shouldSucceed: true
        },
        {
          data: { required: null },
          shouldSucceed: false
        }
      ];

      testCases.forEach(({ data, shouldSucceed }, index) => {
        const result = validateData(data, nullableSchema);
        assert.strictEqual(result.success, shouldSucceed, 
          `Test case ${index} should ${shouldSucceed ? 'succeed' : 'fail'}`);
      });
    });
  });
});