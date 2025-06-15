/**
 * Campaign CRUD integration tests
 */

// Archivo temporalmente deshabilitado: no contiene tests reales

// import { test, describe, beforeEach, afterEach } from 'node:test';
// import assert from 'node:assert';
// import { mockSupabaseService } from '../mocks/supabase.js';
// import { mockResendService } from '../mocks/resend.js';
// import { 
//   validCampaignData, 
//   scheduledCampaignData, 
//   invalidCampaignData,
//   campaignWithInvalidLeads,
//   mockLeads 
// } from '../fixtures/campaigns.js';

// // Mock authenticated user and tenant
// const mockUser = {
//   id: 'user-123',
//   email: 'test@example.com',
//   role: 'user'
// };

import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { mockSupabaseService } from '../mocks/supabase.js';
import { mockResendService } from '../mocks/resend.js';
import { 
  validCampaignData, 
  scheduledCampaignData, 
  invalidCampaignData,
  campaignWithInvalidLeads,
  mockLeads 
} from '../fixtures/campaigns.js';

// Mock authenticated user and tenant
const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  role: 'user'
};

const mockTenant = {
  id: 'tenant-123',
  name: 'Test Company'
};

const mockReq = {
  id: 'req-123',
  user: mockUser,
  tenant: mockTenant,
  tenantId: 'tenant-123'
};

// Archivo de test vacío. Comentar para evitar error de test suite.
// describe('integration campaigns', () => { /* ... */ });

describe('Campaign CRUD Integration Tests', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockSupabaseService.clearHistory();
    mockSupabaseService.clearMockData();
    mockResendService.clearSentEmails();
    mockResendService.setFailureMode(false);
    
    // Add mock leads
    mockLeads.forEach(lead => {
      mockSupabaseService.addMockData('leads', lead);
    });

    if (!mockSupabaseService || !mockResendService) throw new Error('Mocks not loaded: mockSupabaseService or mockResendService');
  });

  afterEach(() => {
    // Clean up after each test
    mockSupabaseService.clearHistory();
    mockSupabaseService.clearMockData();
    mockResendService.clearSentEmails();
  });

  describe('Create Campaign', () => {
    test('should create campaign successfully with valid data', async () => {
      // Import campaign creation function
      const { createCampaign } = await import('../../src/campaigns/createCampaign.js');
      
      // Mock the service
      const originalSupabaseService = (await import('../../src/services/supabase.js')).default;
      
      // Replace with mock temporarily
      const supabaseModule = await import('../../src/services/supabase.js');
      supabaseModule.default = mockSupabaseService;
      
      try {
        const result = await createCampaign(
          validCampaignData,
          mockUser.id,
          mockTenant.id
        );
        
        assert.strictEqual(result.success, true);
        assert.ok(result.campaign);
        assert.strictEqual(result.campaign.name, validCampaignData.name);
        assert.strictEqual(result.campaign.subject, validCampaignData.subject);
        assert.strictEqual(result.campaign.total_recipients, validCampaignData.leadIds.length);
        
        // Verify database operations
        const history = mockSupabaseService.getHistory();
        assert.ok(history.inserts.length > 0);
        
        const campaignInsert = history.inserts.find(insert => insert.table === 'campaigns');
        assert.ok(campaignInsert);
        assert.strictEqual(campaignInsert.data.name, validCampaignData.name);
        
      } finally {
        // Restore original service
        supabaseModule.default = originalSupabaseService;
      }
    });

    test('should reject campaign with empty name', async () => {
      const { createCampaign } = await import('../../src/campaigns/createCampaign.js');
      
      const supabaseModule = await import('../../src/services/supabase.js');
      const originalSupabaseService = supabaseModule.default;
      supabaseModule.default = mockSupabaseService;
      
      try {
        const result = await createCampaign(
          invalidCampaignData,
          mockUser.id,
          mockTenant.id
        );
        
        assert.strictEqual(result.success, false);
        assert.ok(result.error);
        assert.ok(result.details);
        
        // Should not create any database records
        const history = mockSupabaseService.getHistory();
        const campaignInserts = history.inserts.filter(insert => insert.table === 'campaigns');
        assert.strictEqual(campaignInserts.length, 0);
        
      } finally {
        supabaseModule.default = originalSupabaseService;
      }
    });

    test('should reject campaign with invalid lead IDs', async () => {
      const { createCampaign } = await import('../../src/campaigns/createCampaign.js');
      
      const supabaseModule = await import('../../src/services/supabase.js');
      const originalSupabaseService = supabaseModule.default;
      supabaseModule.default = mockSupabaseService;
      
      try {
        const result = await createCampaign(
          campaignWithInvalidLeads,
          mockUser.id,
          mockTenant.id
        );
        
        assert.strictEqual(result.success, false);
        assert.ok(result.error.includes('leads do not belong'));
        
      } finally {
        supabaseModule.default = originalSupabaseService;
      }
    });

    test('should create scheduled campaign with future date', async () => {
      const { createCampaign } = await import('../../src/campaigns/createCampaign.js');
      
      const supabaseModule = await import('../../src/services/supabase.js');
      const originalSupabaseService = supabaseModule.default;
      supabaseModule.default = mockSupabaseService;
      
      try {
        const result = await createCampaign(
          scheduledCampaignData,
          mockUser.id,
          mockTenant.id
        );
        
        assert.strictEqual(result.success, true);
        assert.strictEqual(result.campaign.status, 'scheduled');
        assert.ok(result.campaign.schedule_at);
        
      } finally {
        supabaseModule.default = originalSupabaseService;
      }
    });
  });

  describe('Read Campaigns', () => {
    test('should retrieve campaigns list for tenant', async () => {
      // Add mock campaign data
      mockSupabaseService.addMockData('campaigns', {
        id: 'campaign-1',
        tenant_id: 'tenant-123',
        name: 'Test Campaign 1',
        status: 'draft'
      });
      
      mockSupabaseService.addMockData('campaigns', {
        id: 'campaign-2',
        tenant_id: 'tenant-123',
        name: 'Test Campaign 2',
        status: 'sent'
      });
      
      const result = await mockSupabaseService.query('campaigns', {
        filters: { tenant_id: 'tenant-123' }
      });
      
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.data.length, 2);
      assert.strictEqual(result.data[0].tenant_id, 'tenant-123');
    });

    test('should retrieve single campaign by ID', async () => {
      const campaignId = 'campaign-123';
      mockSupabaseService.addMockData('campaigns', {
        id: campaignId,
        tenant_id: 'tenant-123',
        name: 'Test Campaign',
        status: 'draft'
      });
      
      const result = await mockSupabaseService.query('campaigns', {
        filters: { 
          id: campaignId,
          tenant_id: 'tenant-123'
        }
      });
      
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.data.length, 1);
      assert.strictEqual(result.data[0].id, campaignId);
    });

    test('should return empty list for non-existent tenant', async () => {
      const result = await mockSupabaseService.query('campaigns', {
        filters: { tenant_id: 'non-existent-tenant' }
      });
      
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.data.length, 0);
    });
  });

  describe('Update Campaign', () => {
    test('should update campaign name and subject', async () => {
      const { updateCampaign } = await import('../../src/campaigns/createCampaign.js');
      
      const supabaseModule = await import('../../src/services/supabase.js');
      const originalSupabaseService = supabaseModule.default;
      supabaseModule.default = mockSupabaseService;
      
      // Add existing campaign
      const campaignId = 'campaign-123';
      mockSupabaseService.addMockData('campaigns', {
        id: campaignId,
        tenant_id: 'tenant-123',
        name: 'Original Name',
        subject: 'Original Subject',
        status: 'draft',
        sent_count: 0
      });
      
      try {
        const updateData = {
          name: 'Updated Name',
          subject: 'Updated Subject'
        };
        
        const result = await updateCampaign(
          campaignId,
          updateData,
          mockUser.id,
          mockTenant.id
        );
        
        assert.strictEqual(result.success, true);
        assert.strictEqual(result.campaign.name, updateData.name);
        assert.strictEqual(result.campaign.subject, updateData.subject);
        
        // Verify update operation
        const history = mockSupabaseService.getHistory();
        const updateOp = history.updates.find(update => 
          update.table === 'campaigns' && update.value === campaignId
        );
        assert.ok(updateOp);
        
      } finally {
        supabaseModule.default = originalSupabaseService;
      }
    });

    test('should reject update of sent campaign', async () => {
      const { updateCampaign } = await import('../../src/campaigns/createCampaign.js');
      
      const supabaseModule = await import('../../src/services/supabase.js');
      const originalSupabaseService = supabaseModule.default;
      supabaseModule.default = mockSupabaseService;
      
      // Add sent campaign
      const campaignId = 'campaign-123';
      mockSupabaseService.addMockData('campaigns', {
        id: campaignId,
        tenant_id: 'tenant-123',
        status: 'sent',
        sent_count: 10
      });
      
      try {
        const result = await updateCampaign(
          campaignId,
          { name: 'New Name' },
          mockUser.id,
          mockTenant.id
        );
        
        assert.strictEqual(result.success, false);
        assert.ok(result.error.includes('already been sent'));
        
      } finally {
        supabaseModule.default = originalSupabaseService;
      }
    });
  });

  describe('Delete Campaign', () => {
    test('should soft delete campaign successfully', async () => {
      const { deleteCampaign } = await import('../../src/campaigns/deleteCampaign.js');
      
      const supabaseModule = await import('../../src/services/supabase.js');
      const originalSupabaseService = supabaseModule.default;
      supabaseModule.default = mockSupabaseService;
      
      // Add deletable campaign
      const campaignId = 'campaign-123';
      mockSupabaseService.addMockData('campaigns', {
        id: campaignId,
        tenant_id: 'tenant-123',
        status: 'draft',
        name: 'Test Campaign'
      });
      
      try {
        const result = await deleteCampaign(
          campaignId,
          mockUser.id,
          mockTenant.id
        );
        
        assert.strictEqual(result.success, true);
        assert.ok(result.message.includes('deleted'));
        
        // Verify soft delete (status update)
        const history = mockSupabaseService.getHistory();
        const updateOp = history.updates.find(update => 
          update.table === 'campaigns' && 
          update.value === campaignId &&
          update.data.status === 'deleted'
        );
        assert.ok(updateOp);
        
      } finally {
        supabaseModule.default = originalSupabaseService;
      }
    });

    test('should reject deletion of active campaign', async () => {
      const { deleteCampaign } = await import('../../src/campaigns/deleteCampaign.js');
      
      const supabaseModule = await import('../../src/services/supabase.js');
      const originalSupabaseService = supabaseModule.default;
      supabaseModule.default = mockSupabaseService;
      
      // Add active campaign
      const campaignId = 'campaign-123';
      mockSupabaseService.addMockData('campaigns', {
        id: campaignId,
        tenant_id: 'tenant-123',
        status: 'sending'
      });
      
      try {
        const result = await deleteCampaign(
          campaignId,
          mockUser.id,
          mockTenant.id
        );
        
        assert.strictEqual(result.success, false);
        assert.ok(result.error.includes('Cannot delete'));
        
      } finally {
        supabaseModule.default = originalSupabaseService;
      }
    });
  });

  describe('Campaign Business Logic', () => {
    test('should determine correct status for scheduled campaign', () => {
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      const isScheduled = futureDate && new Date(futureDate) > new Date();
      const status = isScheduled ? 'scheduled' : 'draft';
      
      assert.strictEqual(status, 'scheduled');
    });

    test('should determine correct status for past scheduled campaign', () => {
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const isScheduled = pastDate && new Date(pastDate) > new Date();
      const status = isScheduled ? 'scheduled' : 'draft';
      
      assert.strictEqual(status, 'draft');
    });

    test('should calculate campaign statistics correctly', () => {
      const totalRecipients = 100;
      const delivered = 95;
      const opened = 30;
      const clicked = 5;
      
      const deliveryRate = Math.round((delivered / totalRecipients) * 100);
      const openRate = Math.round((opened / delivered) * 100);
      const clickRate = Math.round((clicked / opened) * 100);
      
      assert.strictEqual(deliveryRate, 95);
      assert.strictEqual(openRate, 32); // 31.57 rounded
      assert.strictEqual(clickRate, 17); // 16.67 rounded
    });

    test('should handle zero division in statistics', () => {
      const delivered = 0;
      const opened = 0;
      const openRate = delivered > 0 ? Math.round((opened / delivered) * 100) : 0;
      
      assert.strictEqual(openRate, 0);
    });
  });
});