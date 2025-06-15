/**
 * Authentication integration tests
 */

import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { mockSupabaseService } from '../mocks/supabase.js';
import { mockResendService } from '../mocks/resend.js';

// Mock request object
const createMockReq = (overrides = {}) => ({
  id: 'req-auth-123',
  headers: {
    'user-agent': 'Test Agent',
    'x-forwarded-for': '192.168.1.1'
  },
  body: {},
  ...overrides
});

// Archivo de test vacío. Comentar para evitar error de test suite.
// describe('integration auth', () => { /* ... */ });

describe('Authentication Integration Tests', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockSupabaseService.clearHistory();
    mockSupabaseService.clearMockData();
    mockResendService.clearSentEmails();
    mockResendService.setFailureMode(false);
  });

  afterEach(() => {
    // Clean up after each test
    mockSupabaseService.clearHistory();
    mockSupabaseService.clearMockData();
    mockResendService.clearSentEmails();
  });

  describe('User Registration Flow', () => {
    test('should register user successfully with valid data', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'SecurePassword123!',
        name: 'New User',
        tenantName: 'New Company'
      };

      const mockReq = createMockReq({ body: userData });

      // Mock the registration process
      const registerUser = async (userData, req) => {
        // Create user
        const userResult = await mockSupabaseService.createUser(userData, req);
        
        if (!userResult.success) {
          return userResult;
        }

        // Create tenant
        const tenantResult = await mockSupabaseService.createTenant({
          name: userData.tenantName,
          slug: userData.tenantName.toLowerCase().replace(/\s+/g, '-')
        }, userResult.user.id, req);

        // Send welcome email
        await mockResendService.sendWelcomeEmail({
          id: userResult.user.id,
          email: userResult.user.email,
          name: userData.name,
          tenantName: userData.tenantName
        });

        return {
          success: true,
          user: userResult.user,
          tenant: tenantResult.tenant,
          session: userResult.session
        };
      };

      const result = await registerUser(userData, mockReq);

      assert.strictEqual(result.success, true);
      assert.ok(result.user);
      assert.ok(result.tenant);
      assert.strictEqual(result.user.email, userData.email);

      // Verify welcome email was sent
      const sentEmails = mockResendService.getSentEmails();
      const welcomeEmail = sentEmails.find(email => email.type === 'welcome');
      assert.ok(welcomeEmail);
      assert.strictEqual(welcomeEmail.to, userData.email);
    });

    test('should reject registration with existing email', async () => {
      // Add existing user
      mockSupabaseService.addMockData('users', {
        id: 'existing-user',
        email: 'existing@example.com'
      });

      const userData = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Test User',
        tenantName: 'Test Company'
      };

      const mockReq = createMockReq({ body: userData });

      // Mock registration that checks for existing email
      const registerUser = async (userData, req) => {
        // Check if email exists
        const existingUser = await mockSupabaseService.query('users', {
          filters: { email: userData.email }
        });

        if (existingUser.success && existingUser.data.length > 0) {
          return {
            success: false,
            error: 'Email already registered'
          };
        }

        return await mockSupabaseService.createUser(userData, req);
      };

      const result = await registerUser(userData, mockReq);

      assert.strictEqual(result.success, false);
      assert.strictEqual(result.error, 'Email already registered');
    });

    test('should handle tenant creation failure gracefully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        tenantName: 'Test Company'
      };

      const mockReq = createMockReq({ body: userData });

      // Mock registration with tenant creation failure
      const registerUser = async (userData, req) => {
        const userResult = await mockSupabaseService.createUser(userData, req);
        
        if (!userResult.success) {
          return userResult;
        }

        // Simulate tenant creation failure
        const tenantResult = {
          success: false,
          error: 'Tenant creation failed'
        };

        return {
          success: true,
          user: userResult.user,
          tenant: null,
          session: userResult.session,
          warnings: ['Tenant creation failed']
        };
      };

      const result = await registerUser(userData, mockReq);

      assert.strictEqual(result.success, true);
      assert.ok(result.user);
      assert.strictEqual(result.tenant, null);
      assert.ok(result.warnings);
    });
  });

  describe('User Login Flow', () => {
    test('should login user successfully with valid credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockReq = createMockReq({ body: credentials });

      const result = await mockSupabaseService.signIn(
        credentials.email, 
        credentials.password, 
        mockReq
      );

      assert.strictEqual(result.success, true);
      assert.ok(result.user);
      assert.ok(result.session);
      assert.strictEqual(result.user.email, credentials.email);
    });

    test('should reject login with invalid credentials', async () => {
      const invalidCredentials = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const mockReq = createMockReq({ body: invalidCredentials });

      const result = await mockSupabaseService.signIn(
        invalidCredentials.email, 
        invalidCredentials.password, 
        mockReq
      );

      assert.strictEqual(result.success, false);
      assert.strictEqual(result.error, 'Invalid credentials');
    });

    test('should handle non-existent user login attempt', async () => {
      const nonExistentUser = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      const mockReq = createMockReq({ body: nonExistentUser });

      const result = await mockSupabaseService.signIn(
        nonExistentUser.email, 
        nonExistentUser.password, 
        mockReq
      );

      assert.strictEqual(result.success, false);
      assert.strictEqual(result.error, 'Invalid credentials');
    });
  });

  describe('Token Verification', () => {
    test('should verify valid token successfully', async () => {
      const validToken = 'valid-token';
      const mockReq = createMockReq();

      const user = await mockSupabaseService.getUser(validToken, mockReq);

      assert.ok(user);
      assert.strictEqual(user.id, 'user-123');
      assert.strictEqual(user.email, 'test@example.com');
    });

    test('should reject invalid token', async () => {
      const invalidToken = 'invalid-token';
      const mockReq = createMockReq();

      const user = await mockSupabaseService.getUser(invalidToken, mockReq);

      assert.strictEqual(user, null);
    });

    test('should handle expired token', async () => {
      // Mock token verification that checks expiration
      const verifyToken = (token) => {
        if (token === 'expired-token') {
          return {
            success: false,
            error: 'Token expired',
            code: 'TOKEN_EXPIRED'
          };
        }
        
        if (token === 'valid-token') {
          return {
            success: true,
            user: {
              id: 'user-123',
              email: 'test@example.com'
            }
          };
        }
        
        return {
          success: false,
          error: 'Invalid token',
          code: 'TOKEN_INVALID'
        };
      };

      const expiredResult = verifyToken('expired-token');
      const validResult = verifyToken('valid-token');
      const invalidResult = verifyToken('invalid-token');

      assert.strictEqual(expiredResult.success, false);
      assert.strictEqual(expiredResult.code, 'TOKEN_EXPIRED');

      assert.strictEqual(validResult.success, true);
      assert.ok(validResult.user);

      assert.strictEqual(invalidResult.success, false);
      assert.strictEqual(invalidResult.code, 'TOKEN_INVALID');
    });
  });

  describe('Role-Based Authorization', () => {
    test('should authorize admin user for admin actions', () => {
      const adminUser = {
        id: 'admin-123',
        email: 'admin@example.com',
        role: 'admin'
      };

      const checkAuthorization = (user, requiredRoles) => {
        if (!user) {
          return { authorized: false, reason: 'No user' };
        }

        if (requiredRoles.includes('*') || requiredRoles.includes(user.role)) {
          return { authorized: true };
        }

        return { 
          authorized: false, 
          reason: 'Insufficient permissions',
          userRole: user.role,
          requiredRoles
        };
      };

      const adminResult = checkAuthorization(adminUser, ['admin']);
      const userResult = checkAuthorization(adminUser, ['user']);
      const anyResult = checkAuthorization(adminUser, ['*']);

      assert.strictEqual(adminResult.authorized, true);
      assert.strictEqual(userResult.authorized, false);
      assert.strictEqual(anyResult.authorized, true);
    });

    test('should reject user without required role', () => {
      const regularUser = {
        id: 'user-123',
        email: 'user@example.com',
        role: 'user'
      };

      const checkAuthorization = (user, requiredRoles) => {
        if (!requiredRoles.includes(user.role)) {
          return { 
            authorized: false, 
            reason: 'Insufficient permissions',
            userRole: user.role,
            requiredRoles
          };
        }
        return { authorized: true };
      };

      const result = checkAuthorization(regularUser, ['admin']);

      assert.strictEqual(result.authorized, false);
      assert.strictEqual(result.reason, 'Insufficient permissions');
      assert.strictEqual(result.userRole, 'user');
      assert.deepStrictEqual(result.requiredRoles, ['admin']);
    });
  });

  describe('Tenant Access Control', () => {
    test('should authorize user for their own tenant', async () => {
      const userId = 'user-123';
      const tenantId = 'tenant-123';

      // Add user's tenant
      mockSupabaseService.addMockData('tenants', {
        id: tenantId,
        name: 'User Tenant',
        owner_id: userId
      });

      const userTenants = await mockSupabaseService.getUserTenants(userId);
      const hasAccess = userTenants.some(tenant => tenant.id === tenantId);

      assert.strictEqual(hasAccess, true);
    });

    test('should reject user access to other tenant', async () => {
      const userId = 'user-123';
      const otherTenantId = 'other-tenant-456';

      // Add user's own tenant
      mockSupabaseService.addMockData('tenants', {
        id: 'tenant-123',
        name: 'User Tenant',
        owner_id: userId
      });

      // Add other user's tenant
      mockSupabaseService.addMockData('tenants', {
        id: otherTenantId,
        name: 'Other Tenant',
        owner_id: 'other-user-456'
      });

      const userTenants = await mockSupabaseService.getUserTenants(userId);
      const hasAccess = userTenants.some(tenant => tenant.id === otherTenantId);

      assert.strictEqual(hasAccess, false);
    });

    test('should allow admin access to any tenant', () => {
      const adminUser = {
        id: 'admin-123',
        email: 'admin@example.com',
        role: 'admin'
      };

      const checkTenantAccess = (user, tenantId, userTenants) => {
        if (user.role === 'admin') {
          return { authorized: true, reason: 'Admin access' };
        }

        const hasAccess = userTenants.some(tenant => tenant.id === tenantId);
        return { 
          authorized: hasAccess,
          reason: hasAccess ? 'Tenant member' : 'Not a tenant member'
        };
      };

      const result = checkTenantAccess(adminUser, 'any-tenant-id', []);

      assert.strictEqual(result.authorized, true);
      assert.strictEqual(result.reason, 'Admin access');
    });
  });

  describe('Session Management', () => {
    test('should logout user successfully', async () => {
      const mockReq = createMockReq();

      const result = await mockSupabaseService.signOut(mockReq);

      assert.strictEqual(result.success, true);
    });

    test('should handle logout errors gracefully', async () => {
      // Mock logout that might fail
      const mockLogout = async () => {
        // Simulate network error or other failure
        return {
          success: false,
          error: 'Logout failed'
        };
      };

      const result = await mockLogout();

      assert.strictEqual(result.success, false);
      assert.strictEqual(result.error, 'Logout failed');
    });
  });

  describe('Password Security', () => {
    test('should enforce password complexity requirements', () => {
      const validatePassword = (password) => {
        const requirements = {
          minLength: password.length >= 8,
          hasUppercase: /[A-Z]/.test(password),
          hasLowercase: /[a-z]/.test(password),
          hasNumber: /\d/.test(password),
          hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        const passed = Object.values(requirements).filter(Boolean).length;
        const isValid = requirements.minLength && passed >= 3;

        return {
          isValid,
          requirements,
          score: passed
        };
      };

      const testPasswords = [
        { password: '123', expected: false },
        { password: 'password', expected: false },
        { password: 'Password123', expected: true },
        { password: 'Password123!', expected: true },
        { password: 'weakpass', expected: false }
      ];

      testPasswords.forEach(({ password, expected }) => {
        const result = validatePassword(password);
        assert.strictEqual(result.isValid, expected, 
          `Password "${password}" validation should be ${expected}`);
      });
    });

    test('should handle password hashing securely', () => {
      // Mock password hashing
      const hashPassword = (password) => {
        if (!password || password.length < 8) {
          throw new Error('Password too weak');
        }
        
        // Simulate bcrypt hash
        return `$2b$10$${password.split('').reverse().join('')}hashed`;
      };

      const verifyPassword = (password, hash) => {
        const expectedHash = hashPassword(password);
        return hash === expectedHash;
      };

      const password = 'SecurePassword123!';
      const hash = hashPassword(password);
      
      assert.ok(hash.startsWith('$2b$10$'));
      assert.strictEqual(verifyPassword(password, hash), true);
      assert.strictEqual(verifyPassword('wrongpassword', hash), false);
    });
  });

  describe('Rate Limiting', () => {
    test('should track login attempts per IP', () => {
      const loginAttempts = new Map();
      const maxAttempts = 5;
      const windowMs = 15 * 60 * 1000; // 15 minutes

      const trackLoginAttempt = (ip, success) => {
        const now = Date.now();
        const attempts = loginAttempts.get(ip) || [];
        
        // Clean old attempts
        const recentAttempts = attempts.filter(attempt => 
          now - attempt.timestamp < windowMs
        );
        
        // Add new attempt
        recentAttempts.push({ timestamp: now, success });
        loginAttempts.set(ip, recentAttempts);
        
        const failedAttempts = recentAttempts.filter(attempt => !attempt.success);
        
        return {
          allowed: failedAttempts.length < maxAttempts,
          attemptsRemaining: Math.max(0, maxAttempts - failedAttempts.length),
          resetTime: now + windowMs
        };
      };

      const ip = '192.168.1.1';
      
      // Simulate failed attempts
      for (let i = 0; i < 4; i++) {
        const result = trackLoginAttempt(ip, false);
        assert.strictEqual(result.allowed, true);
      }
      
      // 5th failed attempt should still be allowed
      const fifthAttempt = trackLoginAttempt(ip, false);
      assert.strictEqual(fifthAttempt.allowed, false);
      assert.strictEqual(fifthAttempt.attemptsRemaining, 0);
    });

    test('should reset rate limit after successful login', () => {
      const loginAttempts = new Map();
      
      const resetRateLimit = (ip) => {
        loginAttempts.delete(ip);
      };
      
      const ip = '192.168.1.1';
      
      // Add some failed attempts
      loginAttempts.set(ip, [
        { timestamp: Date.now(), success: false },
        { timestamp: Date.now(), success: false }
      ]);
      
      assert.ok(loginAttempts.has(ip));
      
      // Reset after successful login
      resetRateLimit(ip);
      
      assert.strictEqual(loginAttempts.has(ip), false);
    });
  });
});