/**
 * Main API routes with multi-tenant support
 */

import express from 'express';
import { authMiddleware, apiKeyMiddleware } from '../middleware/auth.js';
import { requireTenantPermission, checkTenantLimits } from '../middleware/tenant.js';

// Import controllers
import { leadController } from '../controllers/leadController.js';
import { agentActionController } from '../controllers/agentActionController.js';
import { campaignController } from '../controllers/campaignController.js';
import { analyticsController } from '../controllers/analyticsController.js';
import { tenantController } from '../controllers/tenantController.js';

const router = express.Router();

// ============================================================================
// AUTHENTICATION ROUTES (No tenant required initially)
// ============================================================================

router.post('/auth/register', tenantController.register);
router.post('/auth/login', tenantController.login);
router.post('/auth/logout', authMiddleware, tenantController.logout);
router.get('/auth/profile', authMiddleware, tenantController.getProfile);
router.put('/auth/profile', authMiddleware, tenantController.updateProfile);

// ============================================================================
// AGENT ACTIONS (CURSOR Integration) - API Key Authentication
// ============================================================================

router.post('/agent-actions', 
  apiKeyMiddleware,
  requireTenantPermission('api:access'),
  agentActionController.createAction
);

router.get('/agent-actions',
  apiKeyMiddleware,
  requireTenantPermission('api:access'),
  agentActionController.listActions
);

router.get('/agent-actions/:id',
  apiKeyMiddleware,
  requireTenantPermission('api:access'),
  agentActionController.getAction
);

router.put('/agent-actions/:id',
  apiKeyMiddleware,
  requireTenantPermission('api:access'),
  agentActionController.updateAction
);

router.get('/agent-actions/stats',
  apiKeyMiddleware,
  requireTenantPermission('api:access'),
  agentActionController.getStats
);

// ============================================================================
// LEADS MANAGEMENT - JWT Authentication (Frontend)
// ============================================================================

router.get('/leads',
  authMiddleware,
  requireTenantPermission('leads:read'),
  leadController.listLeads
);

router.post('/leads',
  authMiddleware,
  requireTenantPermission('leads:create'),
  checkTenantLimits('leads'),
  leadController.createLead
);

router.get('/leads/:id',
  authMiddleware,
  requireTenantPermission('leads:read'),
  leadController.getLead
);

router.put('/leads/:id',
  authMiddleware,
  requireTenantPermission('leads:update'),
  leadController.updateLead
);

router.delete('/leads/:id',
  authMiddleware,
  requireTenantPermission('leads:delete'),
  leadController.deleteLead
);

router.post('/leads/bulk',
  authMiddleware,
  requireTenantPermission('leads:create'),
  checkTenantLimits('leads'),
  leadController.bulkCreateLeads
);

router.get('/leads/stats',
  authMiddleware,
  requireTenantPermission('leads:read'),
  leadController.getLeadsStats
);

// ============================================================================
// CAMPAIGNS MANAGEMENT - JWT Authentication (Frontend)
// ============================================================================

router.get('/campaigns',
  authMiddleware,
  requireTenantPermission('campaigns:read'),
  campaignController.listCampaigns
);

router.post('/campaigns',
  authMiddleware,
  requireTenantPermission('campaigns:create'),
  checkTenantLimits('campaigns'),
  campaignController.createCampaign
);

router.get('/campaigns/:id',
  authMiddleware,
  requireTenantPermission('campaigns:read'),
  campaignController.getCampaign
);

router.put('/campaigns/:id',
  authMiddleware,
  requireTenantPermission('campaigns:update'),
  campaignController.updateCampaign
);

router.delete('/campaigns/:id',
  authMiddleware,
  requireTenantPermission('campaigns:delete'),
  campaignController.deleteCampaign
);

router.post('/campaigns/:id/send',
  authMiddleware,
  requireTenantPermission('campaigns:send'),
  campaignController.sendCampaign
);

router.get('/campaigns/:id/stats',
  authMiddleware,
  requireTenantPermission('campaigns:read'),
  campaignController.getCampaignStats
);

// ============================================================================
// ANALYTICS - JWT Authentication (Frontend)
// ============================================================================

router.get('/analytics/dashboard',
  authMiddleware,
  requireTenantPermission('analytics:read'),
  analyticsController.getDashboard
);

router.get('/analytics/leads',
  authMiddleware,
  requireTenantPermission('analytics:read'),
  analyticsController.getLeadsAnalytics
);

router.get('/analytics/campaigns',
  authMiddleware,
  requireTenantPermission('analytics:read'),
  analyticsController.getCampaignsAnalytics
);

router.get('/analytics/performance',
  authMiddleware,
  requireTenantPermission('analytics:read'),
  analyticsController.getPerformanceAnalytics
);

// ============================================================================
// TENANT MANAGEMENT - JWT Authentication (Frontend)
// ============================================================================

router.get('/tenant',
  authMiddleware,
  tenantController.getCurrentTenant
);

router.put('/tenant',
  authMiddleware,
  requireTenantPermission('tenant:update'),
  tenantController.updateTenant
);

router.get('/tenant/members',
  authMiddleware,
  requireTenantPermission('tenant:read'),
  tenantController.getTenantMembers
);

router.post('/tenant/members',
  authMiddleware,
  requireTenantPermission('tenant:manage'),
  checkTenantLimits('users'),
  tenantController.inviteMember
);

router.put('/tenant/members/:userId',
  authMiddleware,
  requireTenantPermission('tenant:manage'),
  tenantController.updateMember
);

router.delete('/tenant/members/:userId',
  authMiddleware,
  requireTenantPermission('tenant:manage'),
  tenantController.removeMember
);

router.get('/tenant/api-keys',
  authMiddleware,
  requireTenantPermission('api:manage'),
  tenantController.getApiKeys
);

router.post('/tenant/api-keys',
  authMiddleware,
  requireTenantPermission('api:manage'),
  tenantController.createApiKey
);

router.delete('/tenant/api-keys/:keyId',
  authMiddleware,
  requireTenantPermission('api:manage'),
  tenantController.revokeApiKey
);

// ============================================================================
// SYSTEM ENDPOINTS (Admin only)
// ============================================================================

router.get('/system/tenants',
  authMiddleware,
  requireTenantPermission('system:admin'),
  tenantController.listAllTenants
);

router.get('/system/stats',
  authMiddleware,
  requireTenantPermission('system:admin'),
  analyticsController.getSystemStats
);

// ============================================================================
// WEBHOOKS (No authentication - verified by signature)
// ============================================================================

router.post('/webhooks/stripe', tenantController.handleStripeWebhook);
router.post('/webhooks/resend', tenantController.handleResendWebhook);
router.post('/webhooks/github', tenantController.handleGithubWebhook);

export default router;