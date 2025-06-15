/**
 * Agent Action Controller for CURSOR integration
 */

import { supabaseService } from '../services/supabase.js';
import { logger } from '../utils/common/logger.js';
import { validateData } from '../utils/validation.js';
import { agentActionSchemas } from '../models/agent-action.js';
import { leadSchemas } from '../models/lead.js';
import { ValidationError, NotFoundError } from '../utils/common/errorHandler.js';
import { Request, Response, NextFunction } from 'express';

export class AgentActionController {
  /**
   * Create agent action (CURSOR integration)
   */
  async createAction(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate action data
      const validation = validateData(req.body, agentActionSchemas.create);
      if (!validation.success) {
        throw new ValidationError('Invalid agent action data', validation.errors);
      }

      const { actionType, agentId, priority, payload, context } = validation.data;

      // Process action based on type
      let result;
      switch (actionType) {
        case 'create_lead':
          result = await this.processCreateLead(payload, req);
          break;
        case 'update_lead':
          result = await this.processUpdateLead(payload, req);
          break;
        case 'analyze_company':
          result = await this.processAnalyzeCompany(payload, req);
          break;
        case 'health_check':
          result = await this.processHealthCheck(payload, req);
          break;
        default:
          throw new ValidationError(`Unsupported action type: ${actionType}`);
      }

      // Record the action
      const actionData = {
        tenant_id: req.tenant!.id,
        action_type: actionType,
        agent_id: agentId,
        agent_name: req.body.agentName || agentId,
        agent_version: req.body.agentVersion || '1.0.0',
        priority: priority || 'normal',
        priority_score: this.calculatePriorityScore(priority),
        status: 'completed',
        payload,
        context: context || {},
        results: result,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Add target info if available
      if ((result as any).lead) {
        (actionData as any).target_type = 'lead';
        (actionData as any).target_id = (result as any).lead.id;
      }

      // Save action to database
      const { data: action, error } = await supabaseService.insert(
        'agent_actions',
        actionData,
        req.tenant!.id,
        req
      );

      if (error) {
        throw error;
      }

      logger.info('Agent action created', {
        actionType,
        agentId,
        tenantId: req.tenant!.id,
        tenantSlug: req.tenant!.slug,
        requestId: req.id ?? ''
      });

      res.status(201).json({
        success: true,
        message: 'Action processed successfully',
        action: {
          id: action.id,
          actionType: action.action_type,
          status: action.status,
          results: action.results
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * List agent actions
   */
  async listActions(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 20, status, actionType } = req.query;
      
      const filters: { [key: string]: any } = {
        tenant_id: req.tenant!.id
      };

      if (status) {
        filters.status = status;
      }

      if (actionType) {
        filters.action_type = actionType;
      }

      const result = await supabaseService.query('agent_actions', {
        filters,
        sortBy: 'created_at',
        sortOrder: 'desc',
        limit: parseInt(String(limit)),
        offset: (parseInt(String(page)) - 1) * parseInt(String(limit))
      }, req);

      res.json({
        success: true,
        data: {
          actions: result.data,
          pagination: {
            page: parseInt(String(page)),
            limit: parseInt(String(limit)),
            total: result.count || result.data.length
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get agent action by ID
   */
  async getAction(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const result = await supabaseService.query('agent_actions', {
        filters: {
          id,
          tenant_id: req.tenant!.id
        }
      }, req);

      if (!result.data || result.data.length === 0) {
        throw new NotFoundError('Agent action not found');
      }

      res.json({
        success: true,
        action: result.data[0]
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update agent action
   */
  async updateAction(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const validation = validateData(req.body, agentActionSchemas.update);
      if (!validation.success) {
        throw new ValidationError('Invalid update data', validation.errors);
      }

      const result = await supabaseService.update(
        'agent_actions',
        id,
        {
          ...validation.data,
          updated_at: new Date().toISOString()
        },
        req.tenant!.id,
        req
      );

      if (!result.success) {
        throw new NotFoundError('Agent action not found');
      }

      res.json({
        success: true,
        message: 'Action updated successfully',
        action: result.data
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get agent action statistics
   */
  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      // Get counts by status
      const statusCounts: { [key: string]: any } = {};
      const statuses = ['pending', 'processing', 'completed', 'failed', 'cancelled'];

      for (const status of statuses) {
        const result = await supabaseService.query('agent_actions', {
          filters: {
            tenant_id: req.tenant!.id,
            status
          }
        }, req);

        statusCounts[status] = result.count || 0;
      }

      // Get counts by action type
      const actionTypes: { [key: string]: any } = {};
      const typeCounts: { [key: string]: any } = {};

      for (const actionType of ['create_lead', 'update_lead', 'analyze_company', 'health_check']) {
        const result = await supabaseService.query('agent_actions', {
          filters: {
            tenant_id: req.tenant!.id,
            action_type: actionType
          }
        }, req);

        typeCounts[actionType] = result.count || 0;
      }

      // Get recent actions
      const recentActions = await supabaseService.query('agent_actions', {
        filters: {
          tenant_id: req.tenant!.id
        },
        sortBy: 'created_at',
        sortOrder: 'desc',
        limit: 5
      }, req);

      res.json({
        success: true,
        stats: {
          statusCounts,
          typeCounts,
          total: Object.values(statusCounts).reduce((sum: number, count: number) => sum + (count as number), 0),
          recentActions: recentActions.data
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Process create lead action
   */
  async processCreateLead(payload: any, req: Request) {
    try {
      const { leadData } = payload;

      // Validate lead data
      const validation = validateData(leadData, leadSchemas.create);
      if (!validation.success) {
        throw new ValidationError('Invalid lead data', validation.errors);
      }

      // Format lead data for database
      const formattedLead = {
        tenant_id: req.tenant!.id,
        email: leadData.email,
        first_name: leadData.firstName,
        last_name: leadData.lastName,
        company: leadData.company,
        job_title: leadData.jobTitle,
        phone: leadData.phone,
        website: leadData.website,
        linkedin_url: leadData.linkedinUrl,
        status: 'new',
        source: leadData.source || 'ai_agent',
        priority: leadData.priority || 'medium',
        tags: leadData.tags || [],
        custom_fields: leadData.customFields || {},
        qualification_notes: leadData.qualificationNotes,
        created_by: null, // Created by agent, not user
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Insert lead
      const { data: lead, error } = await supabaseService.adminClient
        .from('leads')
        .insert(formattedLead)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Create lead interaction
      await supabaseService.adminClient
        .from('lead_interactions')
        .insert({
          lead_id: lead.id,
          agent_id: req.agent!.id,
          interaction_type: 'qualification',
          summary: `Lead created by ${req.agent!.id}`,
          confidence: 0.95,
          metadata: {
            source: 'cursor_agent',
            requestId: req.id ?? ''
          }
        });

      logger.info('Lead created by agent', {
        leadId: lead.id,
        email: lead.email,
        agentId: req.agent!.id,
        tenantId: req.tenant!.id,
        tenantSlug: req.tenant!.slug,
        requestId: req.id ?? ''
      });

      return {
        success: true,
        lead: {
          id: lead.id,
          email: lead.email,
          firstName: lead.first_name,
          lastName: lead.last_name,
          company: lead.company,
          source: lead.source
        }
      };
    } catch (error) {
      logger.error('Error creating lead', {
        error: (error as any).message,
        tenantId: req.tenant!.id,
        agentId: req.agent!.id,
        requestId: req.id ?? ''
      });
      throw error;
    }
  }

  /**
   * Process update lead action
   */
  async processUpdateLead(payload: any, req: Request) {
    try {
      const { leadId, updates } = payload;

      if (!leadId) {
        throw new ValidationError('Lead ID is required');
      }

      // Validate update data
      const validation = validateData(updates, leadSchemas.update);
      if (!validation.success) {
        throw new ValidationError('Invalid lead update data', validation.errors);
      }

      // Format updates
      const formattedUpdates: { [key: string]: any } = {
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
        updated_by: null // Updated by agent, not user
      };

      // Remove undefined values
      Object.keys(formattedUpdates).forEach(key => {
        if (formattedUpdates[key] === undefined) {
          delete formattedUpdates[key];
        }
      });

      // Update lead
      const { data: lead, error } = await supabaseService.adminClient
        .from('leads')
        .update(formattedUpdates)
        .eq('id', leadId)
        .eq('tenant_id', req.tenant!.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Create lead interaction
      await supabaseService.adminClient
        .from('lead_interactions')
        .insert({
          lead_id: lead.id,
          agent_id: req.agent!.id,
          interaction_type: 'qualification',
          summary: `Lead updated by ${req.agent!.id}`,
          confidence: 0.9,
          metadata: {
            updates: Object.keys(formattedUpdates),
            source: 'cursor_agent',
            requestId: req.id ?? ''
          }
        });

      logger.info('Lead updated by agent', {
        leadId: lead.id,
        agentId: req.agent!.id,
        tenantId: req.tenant!.id,
        updates: Object.keys(formattedUpdates),
        requestId: req.id ?? ''
      });

      return {
        success: true,
        lead: {
          id: lead.id,
          email: lead.email,
          firstName: lead.first_name,
          lastName: lead.last_name,
          status: lead.status,
          priority: lead.priority
        }
      };
    } catch (error) {
      logger.error('Error updating lead', {
        error: (error as any).message,
        tenantId: req.tenant!.id,
        agentId: req.agent!.id,
        requestId: req.id ?? ''
      });
      throw error;
    }
  }

  /**
   * Process analyze company action
   */
  async processAnalyzeCompany(payload: any, req: Request) {
    try {
      const { analysisData } = payload;

      if (!analysisData || !analysisData.companyName) {
        throw new ValidationError('Company name is required');
      }

      // Simulate company analysis
      const analysis = {
        companyName: analysisData.companyName,
        website: analysisData.website || `https://www.${analysisData.companyName.toLowerCase().replace(/\s+/g, '')}.com`,
        industry: 'Technology', // Simulated
        size: 'Medium', // Simulated
        founded: '2010', // Simulated
        location: 'San Francisco, CA', // Simulated
        keyPeople: [
          { name: 'John Smith', title: 'CEO' },
          { name: 'Sarah Johnson', title: 'CTO' }
        ],
        competitors: ['Competitor A', 'Competitor B'],
        products: ['Product X', 'Product Y'],
        recentNews: [
          { title: 'Company raises $10M', date: '2023-10-15' }
        ],
        socialProfiles: {
          linkedin: `https://www.linkedin.com/company/${analysisData.companyName.toLowerCase().replace(/\s+/g, '')}`,
          twitter: `https://twitter.com/${analysisData.companyName.toLowerCase().replace(/\s+/g, '')}`
        },
        analysisDate: new Date().toISOString(),
        confidence: 0.85
      };

      logger.info('Company analyzed by agent', {
        companyName: analysisData.companyName,
        agentId: req.agent!.id,
        tenantId: req.tenant!.id,
        requestId: req.id ?? ''
      });

      return {
        success: true,
        analysis
      };
    } catch (error) {
      logger.error('Error analyzing company', {
        error: (error as any).message,
        tenantId: req.tenant!.id,
        agentId: req.agent!.id,
        requestId: req.id ?? ''
      });
      throw error;
    }
  }

  /**
   * Process health check action
   */
  async processHealthCheck(payload: any, req: Request) {
    try {
      // Get tenant stats
      const leadCount = await supabaseService.query('leads', {
        tenantId: req.tenant!.id
      }, req);

      const actionCount = await supabaseService.query('agent_actions', {
        tenantId: req.tenant!.id
      }, req);

      const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        tenant: {
          id: req.tenant!.id,
          slug: req.tenant!.slug,
          plan: req.tenant!.plan,
          isActive: req.tenant!.isActive
        },
        agent: {
          id: req.agent!.id,
          type: req.agent!.type
        },
        stats: {
          leadCount: leadCount.count || 0,
          actionCount: actionCount.count || 0
        },
        features: {
          multiTenant: true,
          cursorIntegration: true,
          frontendCompatible: true
        }
      };

      logger.info('Health check by agent', {
        agentId: req.agent!.id,
        tenantId: req.tenant!.id,
        requestId: req.id ?? ''
      });

      return {
        success: true,
        health
      };
    } catch (error) {
      logger.error('Error in health check', {
        error: (error as any).message,
        tenantId: req.tenant!.id,
        agentId: req.agent!.id,
        requestId: req.id ?? ''
      });
      throw error;
    }
  }

  /**
   * Calculate priority score
   */
  calculatePriorityScore(priority: string) {
    const scores = {
      low: 1,
      normal: 2,
      high: 3,
      urgent: 4
    };

    return scores[priority as keyof typeof scores] || 2;
  }
}

export const agentActionController = new AgentActionController();