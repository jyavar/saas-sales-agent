/**
 * Authentication tests
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import { validateData, userSchemas } from '../src/utils/validation.js';

// Archivo de test vacío. Comentar para evitar error de test suite.
// describe('Authentication', () => { /* ... */ });

describe('Authentication', () => {
  describe('User Registration Validation', () => {
    test('should validate correct registration data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        tenantName: 'Test Company'
      };

      const result = validateData(validData, userSchemas.register);
      
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.data.email, validData.email);
      assert.strictEqual(result.data.name, validData.name);
    });

    test('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
        name: 'Test User',
        tenantName: 'Test Company'
      };

      const result = validateData(invalidData, userSchemas.register);
      
      assert.strictEqual(result.success, false);
      assert.ok(result.errors.some(err => err.field === 'email'));
    });

    test('should reject short password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '123',
        name: 'Test User',
        tenantName: 'Test Company'
      };

      const result = validateData(invalidData, userSchemas.register);
      
      assert.strictEqual(result.success, false);
      assert.ok(result.errors.some(err => err.field === 'password'));
    });

    test('should reject missing required fields', () => {
      const invalidData = {
        email: 'test@example.com'
        // Missing password, name, tenantName
      };

      const result = validateData(invalidData, userSchemas.register);
      
      assert.strictEqual(result.success, false);
      assert.ok(result.errors.length > 0);
    });
  });

  describe('User Login Validation', () => {
    test('should validate correct login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const result = validateData(validData, userSchemas.login);
      
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.data.email, validData.email);
      assert.strictEqual(result.data.password, validData.password);
    });

    test('should reject empty credentials', () => {
      const invalidData = {
        email: '',
        password: ''
      };

      const result = validateData(invalidData, userSchemas.login);
      
      assert.strictEqual(result.success, false);
      assert.ok(result.errors.length > 0);
    });
  });
});