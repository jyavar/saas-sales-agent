/**
 * Validation utilities tests
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import { validateData, commonSchemas, paginationSchema } from '../src/utils/validation.js';

describe('Validation Utilities', () => {
  describe('Common Schemas', () => {
    test('should validate correct email', () => {
      const result = validateData('test@example.com', commonSchemas.email);
      
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.data, 'test@example.com');
    });

    test('should reject invalid email', () => {
      const result = validateData('invalid-email', commonSchemas.email);
      
      assert.strictEqual(result.success, false);
      assert.ok(result.errors.length > 0);
    });

    test('should validate strong password', () => {
      const result = validateData('password123', commonSchemas.password);
      
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.data, 'password123');
    });

    test('should reject short password', () => {
      const result = validateData('123', commonSchemas.password);
      
      assert.strictEqual(result.success, false);
      assert.ok(result.errors.some(err => err.message.includes('8 characters')));
    });

    test('should validate UUID', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const result = validateData(uuid, commonSchemas.uuid);
      
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.data, uuid);
    });

    test('should reject invalid UUID', () => {
      const result = validateData('not-a-uuid', commonSchemas.uuid);
      
      assert.strictEqual(result.success, false);
      assert.ok(result.errors.length > 0);
    });

    test('should validate URL', () => {
      const url = 'https://example.com';
      const result = validateData(url, commonSchemas.url);
      
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.data, url);
    });

    test('should reject invalid URL', () => {
      const result = validateData('not-a-url', commonSchemas.url);
      
      assert.strictEqual(result.success, false);
      assert.ok(result.errors.length > 0);
    });

    test('should validate slug', () => {
      const slug = 'valid-slug-123';
      const result = validateData(slug, commonSchemas.slug);
      
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.data, slug);
    });

    test('should reject invalid slug', () => {
      const result = validateData('Invalid Slug!', commonSchemas.slug);
      
      assert.strictEqual(result.success, false);
      assert.ok(result.errors.length > 0);
    });
  });

  describe('Pagination Schema', () => {
    test('should validate pagination with defaults', () => {
      const result = validateData({}, paginationSchema);
      
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.data.page, 1);
      assert.strictEqual(result.data.limit, 20);
      assert.strictEqual(result.data.sortOrder, 'desc');
    });

    test('should validate custom pagination', () => {
      const data = {
        page: '2',
        limit: '50',
        sortBy: 'name',
        sortOrder: 'asc'
      };
      
      const result = validateData(data, paginationSchema);
      
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.data.page, 2);
      assert.strictEqual(result.data.limit, 50);
      assert.strictEqual(result.data.sortBy, 'name');
      assert.strictEqual(result.data.sortOrder, 'asc');
    });

    test('should reject invalid page number', () => {
      const data = { page: '0' };
      const result = validateData(data, paginationSchema);
      
      assert.strictEqual(result.success, false);
      assert.ok(result.errors.length > 0);
    });

    test('should reject excessive limit', () => {
      const data = { limit: '1000' };
      const result = validateData(data, paginationSchema);
      
      assert.strictEqual(result.success, false);
      assert.ok(result.errors.length > 0);
    });

    test('should reject invalid sort order', () => {
      const data = { sortOrder: 'invalid' };
      const result = validateData(data, paginationSchema);
      
      assert.strictEqual(result.success, false);
      assert.ok(result.errors.length > 0);
    });
  });
});