/**
 * Tenant controller for multi-tenant operations
 */

import { tenantService } from '../services/tenant.js';
import { authService } from '../services/auth.js';
import { apiKeyService } from '../services/apiKey.js';
import { webhookService } from '../services/webhook.js';
import { logger } from '../utils/common/logger.js';
import { validateData } from '../utils/validation.js';
import { tenantSchemas } from '../models/tenant.js';
import { userSchemas } from '../models/user.js';
import { ValidationError, UnauthorizedError, ForbiddenError } from '../utils/common/errorHandler.js';
import { webhookOrchestrator } from '../webhooks/webhookOrchestrator';

export class TenantController {
  /**
   * Register new user and create tenant
   */
  async register(req, res, next) {
    try {
      const validation = validateData(req.body, userSchemas.register);
      if (!validation.success) {
        throw new ValidationError('Invalid registration data', validation.errors);
      }

      const { email, password, name, tenantName } = validation.data;

      // Create user
      const userResult = await authService.createUser({
        email,
        password,
        name
      });

      if (!userResult.success) {
        throw new ValidationError(userResult.error);
      }

      // Create tenant
      const tenantSlug = tenantName.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();

      const tenant = await tenantService.createTenant({
        name: tenantName,
        slug: tenantSlug,
        plan: 'free'
      }, userResult.user.id);

      // Generate API key for the tenant
      const apiKey = await apiKeyService.createApiKey({
        tenantId: tenant.id,
        name: 'Default API Key',
        permissions: ['leads:*', 'campaigns:*', 'api:access']
      }, userResult.user.id);

      logger.info('User registered with tenant', {
        userId: userResult.user.id,
        tenantId: tenant.id,
        tenantSlug: tenant.slug,
        requestId: req.id
      });

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        user: {
          id: userResult.user.id,
          email: userResult.user.email,
          name: userResult.user.name
        },
        tenant: {
          id: tenant.id,
          name: tenant.name,
          slug: tenant.slug,
          plan: tenant.plan
        },
        apiKey: apiKey.key,
        session: userResult.session
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login user
   */
  async login(req, res, next) {
    try {
      const validation = validateData(req.body, userSchemas.login);
      if (!validation.success) {
        throw new ValidationError('Invalid login data', validation.errors);
      }

      const { email, password } = validation.data;

      const result = await authService.signIn(email, password);
      if (!result.success) {
        throw new UnauthorizedError(result.error);
      }

      // Get user's tenants
      const tenants = await tenantService.getUserTenants(result.user.id);

      logger.info('User logged in', {
        userId: result.user.id,
        email: result.user.email,
        tenantCount: tenants.length,
        requestId: req.id
      });

      res.json({
        success: true,
        message: 'Login successful',
        user: result.user,
        tenants,
        session: result.session
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout user
   */
  async logout(req, res, next) {
    try {
      await authService.signOut(req.session?.access_token);

      logger.info('User logged out', {
        userId: req.user?.id,
        requestId: req.id
      });

      res.json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user profile
   */
  async getProfile(req, res, next) {
    try {
      const tenants = await tenantService.getUserTenants(req.user.id);

      res.json({
        success: true,
        user: req.user,
        tenants,
        currentTenant: req.tenant
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(req, res, next) {
    try {
      const validation = validateData(req.body, userSchemas.updateProfile);
      if (!validation.success) {
        throw new ValidationError('Invalid profile data', validation.errors);
      }

      const updatedUser = await authService.updateUser(req.user.id, validation.data);

      res.json({
        success: true,
        message: 'Profile updated successfully',
        user: updatedUser
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current tenant
   */
  async getCurrentTenant(req, res, next) {
    try {
      if (!req.tenant) {
        throw new ValidationError('No tenant context');
      }

      res.json({
        success: true,
        tenant: req.tenant
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update tenant
   */
  async updateTenant(req, res, next) {
    try {
      const validation = validateData(req.body, tenantSchemas.update);
      if (!validation.success) {
        throw new ValidationError('Invalid tenant data', validation.errors);
      }

      const updatedTenant = await tenantService.updateTenant(req.tenant.id, validation.data);

      res.json({
        success: true,
        message: 'Tenant updated successfully',
        tenant: updatedTenant
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get tenant members
   */
  async getTenantMembers(req, res, next) {
    try {
      const members = await tenantService.getTenantMembers(req.tenant.id);

      res.json({
        success: true,
        members
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Invite member to tenant
   */
  async inviteMember(req, res, next) {
    try {
      const validation = validateData(req.body, tenantSchemas.inviteMember);
      if (!validation.success) {
        throw new ValidationError('Invalid invitation data', validation.errors);
      }

      const invitation = await tenantService.inviteMember(
        req.tenant.id,
        validation.data,
        req.user.id
      );

      res.status(201).json({
        success: true,
        message: 'Member invited successfully',
        invitation
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update member role
   */
  async updateMember(req, res, next) {
    try {
      const { userId } = req.params;
      const validation = validateData(req.body, tenantSchemas.updateMember);
      if (!validation.success) {
        throw new ValidationError('Invalid member data', validation.errors);
      }

      const updatedMember = await tenantService.updateMember(
        req.tenant.id,
        userId,
        validation.data
      );

      res.json({
        success: true,
        message: 'Member updated successfully',
        member: updatedMember
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove member from tenant
   */
  async removeMember(req, res, next) {
    try {
      const { userId } = req.params;

      await tenantService.removeMember(req.tenant.id, userId);

      res.json({
        success: true,
        message: 'Member removed successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get tenant API keys
   */
  async getApiKeys(req, res, next) {
    try {
      const apiKeys = await apiKeyService.getTenantApiKeys(req.tenant.id);

      res.json({
        success: true,
        apiKeys
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create API key
   */
  async createApiKey(req, res, next) {
    try {
      const validation = validateData(req.body, tenantSchemas.createApiKey);
      if (!validation.success) {
        throw new ValidationError('Invalid API key data', validation.errors);
      }

      const apiKey = await apiKeyService.createApiKey({
        tenantId: req.tenant.id,
        ...validation.data
      }, req.user.id);

      res.status(201).json({
        success: true,
        message: 'API key created successfully',
        apiKey
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Revoke API key
   */
  async revokeApiKey(req, res, next) {
    try {
      const { keyId } = req.params;

      await apiKeyService.revokeApiKey(keyId, req.tenant.id);

      res.json({
        success: true,
        message: 'API key revoked successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * List all tenants (admin only)
   */
  async listAllTenants(req, res, next) {
    try {
      // Check if user is admin
      if (req.user.role !== 'admin') {
        throw new ForbiddenError('Admin access required');
      }

      const tenants = await tenantService.getAllTenants();

      res.json({
        success: true,
        tenants
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle Stripe webhook
   */
  async handleStripeWebhook(req, res, next) {
    try {
      const result = await webhookOrchestrator.processWebhook('stripe', req);
      res.json({
        success: result.success,
        message: result.message,
        eventId: result.eventId
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle Resend webhook
   */
  async handleResendWebhook(req, res, next) {
    try {
      const result = await webhookOrchestrator.processWebhook('resend', req);
      res.json({
        success: result.success,
        message: result.message,
        eventId: result.eventId
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle GitHub webhook
   */
  async handleGithubWebhook(req, res, next) {
    try {
      const result = await webhookOrchestrator.processWebhook('github', req);
      res.json({
        success: result.success,
        message: result.message,
        eventId: result.eventId
      });
    } catch (error) {
      next(error);
    }
  }
}

export const tenantController = new TenantController();
export default tenantController;