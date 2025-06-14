/**
 * Lead controller for multi-tenant lead management
 */

import { logger } from '../utils/common/logger.js';
import { validateData, validateQueryParams } from '../utils/validation.js';
import { leadSchemas, paginationSchema } from '../utils/validation.js';
import { ValidationError, NotFoundError } from '../utils/common/errorHandler.js';
import { listLeads as dalListLeads, createLead as dalCreateLead, getLeadById as dalGetLeadById, updateLead as dalUpdateLead, deleteLead as dalDeleteLead } from '../core/db/leadDataAccess.ts';

export class LeadController {
  /**
   * List leads with pagination and filtering
   */
  async listLeads(req, res, next) {
    try {
      // Validate query parameters
      const queryValidation = validateQueryParams(req.query, paginationSchema);
      if (!queryValidation.success) {
        throw new ValidationError('Invalid query parameters', queryValidation.errors);
      }

      const { page, limit } = queryValidation.data;
      const { status, source, priority } = req.query;
      const filters = {};
      if (status) filters.status = status;
      if (source) filters.source = source;
      if (priority) filters.priority = priority;

      // Get leads from DAL
      const leads = await dalListLeads(req.tenant.id, filters, limit, (page - 1) * limit);

      res.json({
        success: true,
        data: {
          leads,
          pagination: {
            page,
            limit,
            total: leads.length, // Para paginación real, ajustar con count del DAL
            totalPages: 1 // Ajustar si se implementa count real
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new lead
   */
  async createLead(req, res, next) {
    try {
      // Validate lead data
      const validation = validateData(req.body, leadSchemas.create);
      if (!validation.success) {
        throw new ValidationError('Invalid lead data', validation.errors);
      }
      const leadData = validation.data;
      const formattedLead = {
        email: leadData.email,
        first_name: leadData.firstName,
        last_name: leadData.lastName,
        company: leadData.company,
        job_title: leadData.jobTitle,
        phone: leadData.phone,
        website: leadData.website,
        linkedin_url: leadData.linkedinUrl,
        status: 'new',
        source: leadData.source || 'manual',
        priority: leadData.priority || 'medium',
        tags: leadData.tags || [],
        custom_fields: leadData.customFields || {},
        qualification_notes: leadData.qualificationNotes,
        created_by: req.user?.id || null
      };
      const lead = await dalCreateLead(req.tenant.id, formattedLead);
      logger.info('Lead created', {
        leadId: lead.id,
        email: lead.email,
        tenantId: req.tenant.id,
        userId: req.user?.id,
        requestId: req.id
      });
      res.status(201).json({
        success: true,
        message: 'Lead created successfully',
        lead
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get lead by ID
   */
  async getLead(req, res, next) {
    try {
      const { id } = req.params;
      const lead = await dalGetLeadById(req.tenant.id, id);
      if (!lead) {
        throw new NotFoundError('Lead not found');
      }
      // TODO: Obtener interacciones si aplica
      res.json({
        success: true,
        lead
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update lead
   */
  async updateLead(req, res, next) {
    try {
      const { id } = req.params;

      // Validate update data
      const validation = validateData(req.body, leadSchemas.update);
      if (!validation.success) {
        throw new ValidationError('Invalid lead data', validation.errors);
      }

      const updates = validation.data;

      // Format updates
      const formattedUpdates = {
        first_name: updates.firstName,
        last_name: updates.lastName,
        company: updates.company,
        job_title: updates.jobTitle,
        phone: updates.phone,
        website: updates.website,
        linkedin_url: updates.linkedinUrl,
        status: updates.status,
        priority: updates.priority,
        score: updates.score,
        tags: updates.tags,
        custom_fields: updates.customFields,
        qualification_notes: updates.qualificationNotes,
        next_follow_up_at: updates.nextFollowUpAt,
        updated_at: new Date().toISOString(),
        updated_by: req.user?.id
      };

      // Remove undefined values
      Object.keys(formattedUpdates).forEach(key => {
        if (formattedUpdates[key] === undefined) {
          delete formattedUpdates[key];
        }
      });

      // Update lead
      const result = await dalUpdateLead(req.tenant.id, id, formattedUpdates);

      if (!result.success) {
        throw new NotFoundError('Lead not found');
      }

      logger.info('Lead updated', {
        leadId: id,
        tenantId: req.tenant.id,
        userId: req.user?.id,
        updates: Object.keys(formattedUpdates),
        requestId: req.id
      });

      res.json({
        success: true,
        message: 'Lead updated successfully',
        lead: {
          id: result.data.id,
          email: result.data.email,
          firstName: result.data.first_name,
          lastName: result.data.last_name,
          status: result.data.status,
          updatedAt: result.data.updated_at
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete lead
   */
  async deleteLead(req, res, next) {
    try {
      const { id } = req.params;

      const result = await dalDeleteLead(req.tenant.id, id);

      if (!result.success) {
        throw new NotFoundError('Lead not found');
      }

      logger.info('Lead deleted', {
        leadId: id,
        tenantId: req.tenant.id,
        userId: req.user?.id,
        requestId: req.id
      });

      res.json({
        success: true,
        message: 'Lead deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Bulk create leads
   */
  async bulkCreateLeads(req, res, next) {
    try {
      // Validate bulk data
      const validation = validateData(req.body, leadSchemas.bulkCreate);
      if (!validation.success) {
        throw new ValidationError('Invalid bulk lead data', validation.errors);
      }

      const { leads } = validation.data;

      // Format leads
      const formattedLeads = leads.map(lead => ({
        tenant_id: req.tenant.id,
        email: lead.email,
        first_name: lead.firstName,
        last_name: lead.lastName,
        company: lead.company,
        job_title: lead.jobTitle,
        phone: lead.phone,
        website: lead.website,
        linkedin_url: lead.linkedinUrl,
        status: 'new',
        source: lead.source || 'bulk_import',
        priority: lead.priority || 'medium',
        tags: lead.tags || [],
        custom_fields: lead.customFields || {},
        qualification_notes: lead.qualificationNotes,
        created_by: req.user?.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      // Insert leads
      const { data, error } = await dalCreateLead(req.tenant.id, formattedLeads);

      if (error) {
        throw error;
      }

      logger.info('Bulk leads created', {
        count: formattedLeads.length,
        tenantId: req.tenant.id,
        userId: req.user?.id,
        requestId: req.id
      });

      res.status(201).json({
        success: true,
        message: `${data.length} leads created successfully`,
        leads: data
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get lead statistics
   */
  async getLeadsStats(req, res, next) {
    try {
      // Get counts by status
      const statusCounts = {};
      const statuses = ['new', 'contacted', 'qualified', 'converted', 'lost', 'nurturing'];

      for (const status of statuses) {
        const result = await dalListLeads(req.tenant.id, { status }, 0, 0);
        statusCounts[status] = result.length || 0;
      }

      // Get counts by source
      const sourceCounts = {};
      const sources = ['website', 'social_media', 'email_campaign', 'referral', 'ai_agent', 'manual', 'api'];

      for (const source of sources) {
        const result = await dalListLeads(req.tenant.id, { source }, 0, 0);
        sourceCounts[source] = result.length || 0;
      }

      // Get counts by priority
      const priorityCounts = {};
      const priorities = ['low', 'medium', 'high', 'urgent'];

      for (const priority of priorities) {
        const result = await dalListLeads(req.tenant.id, { priority }, 0, 0);
        priorityCounts[priority] = result.length || 0;
      }

      // Get recent leads
      const recentLeads = await dalListLeads(req.tenant.id, {}, 5, 0);

      res.json({
        success: true,
        stats: {
          statusCounts,
          sourceCounts,
          priorityCounts,
          total: Object.values(statusCounts).reduce((sum, count) => sum + count, 0),
          recentLeads: recentLeads.map(lead => ({
            id: lead.id,
            email: lead.email,
            firstName: lead.first_name,
            lastName: lead.last_name,
            company: lead.company,
            status: lead.status,
            source: lead.source,
            createdAt: lead.created_at
          }))
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new LeadController();