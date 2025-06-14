/**
 * Agent Action model and validation schemas
 */

import { z } from 'zod';

// Action type constants
export const ACTION_TYPES = {
  CREATE_LEAD: 'create_lead',
  UPDATE_LEAD: 'update_lead',
  QUALIFY_LEAD: 'qualify_lead',
  SCORE_LEAD: 'score_lead',
  SEND_EMAIL: 'send_email',
  SCHEDULE_CALL: 'schedule_call',
  SEND_MESSAGE: 'send_message',
  ANALYZE_COMPANY: 'analyze_company',
  RESEARCH_CONTACT: 'research_contact',
  SENTIMENT_ANALYSIS: 'sentiment_analysis',
  TRIGGER_WORKFLOW: 'trigger_workflow',
  UPDATE_PIPELINE: 'update_pipeline',
  CREATE_TASK: 'create_task',
  HEALTH_CHECK: 'health_check',
  LOG_EVENT: 'log_event'
};

// Action status constants
export const ACTION_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
};

// Action priority constants
export const ACTION_PRIORITY = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent'
};

// Validation schemas
export const agentActionSchemas = {
  create: z.object({
    actionType: z.enum(Object.values(ACTION_TYPES)),
    agentId: z.string().min(1, 'Agent ID required'),
    agentName: z.string().optional(),
    agentVersion: z.string().optional(),
    priority: z.enum(Object.values(ACTION_PRIORITY)).default(ACTION_PRIORITY.NORMAL),
    targetType: z.enum(['lead', 'campaign', 'workflow', 'system', 'report']).optional(),
    targetId: z.string().uuid().optional(),
    payload: z.record(z.any()),
    context: z.record(z.any()).optional(),
    scheduledAt: z.string().datetime().optional(),
    expiresAt: z.string().datetime().optional()
  }),

  update: z.object({
    status: z.enum(Object.values(ACTION_STATUS)).optional(),
    results: z.record(z.any()).optional(),
    error: z.string().optional()
  }),

  // Specific payload schemas
  payloads: {
    createLead: z.object({
      leadData: z.object({
        email: z.string().email('Valid email required'),
        firstName: z.string().min(1, 'First name required'),
        lastName: z.string().min(1, 'Last name required'),
        company: z.string().optional(),
        jobTitle: z.string().optional(),
        phone: z.string().optional(),
        website: z.string().url().optional(),
        linkedinUrl: z.string().url().optional(),
        source: z.string().optional(),
        priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
        tags: z.array(z.string()).optional(),
        customFields: z.record(z.any()).optional(),
        qualificationNotes: z.string().optional()
      })
    }),

    updateLead: z.object({
      leadId: z.string().uuid('Valid lead ID required'),
      updates: z.object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        company: z.string().optional(),
        jobTitle: z.string().optional(),
        phone: z.string().optional(),
        website: z.string().url().optional(),
        linkedinUrl: z.string().url().optional(),
        status: z.enum(['new', 'contacted', 'qualified', 'converted', 'lost', 'nurturing']).optional(),
        priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
        score: z.number().int().min(0).max(100).optional(),
        tags: z.array(z.string()).optional(),
        customFields: z.record(z.any()).optional(),
        qualificationNotes: z.string().optional(),
        nextFollowUpAt: z.string().datetime().optional()
      })
    }),

    analyzeCompany: z.object({
      analysisData: z.object({
        companyName: z.string().min(1, 'Company name required'),
        website: z.string().url().optional(),
        industry: z.string().optional(),
        location: z.string().optional(),
        employees: z.number().int().positive().optional(),
        founded: z.string().optional(),
        additionalInfo: z.record(z.any()).optional()
      })
    }),

    sendEmail: z.object({
      communicationData: z.object({
        type: z.literal('email'),
        recipient: z.string().email('Valid email required'),
        subject: z.string().min(1, 'Subject required'),
        content: z.string().min(1, 'Content required'),
        template: z.string().optional(),
        attachments: z.array(z.object({
          name: z.string(),
          url: z.string().url()
        })).optional()
      })
    }),

    healthCheck: z.object({
      checkData: z.object({
        components: z.array(z.string()).optional(),
        detailed: z.boolean().optional()
      }).optional()
    })
  }
};

// Agent action helper functions
export const agentActionHelpers = {
  /**
   * Calculate priority score
   */
  calculatePriorityScore(priority) {
    const scores = {
      [ACTION_PRIORITY.LOW]: 1,
      [ACTION_PRIORITY.NORMAL]: 2,
      [ACTION_PRIORITY.HIGH]: 3,
      [ACTION_PRIORITY.URGENT]: 4
    };

    return scores[priority] || 2;
  },

  /**
   * Format action for API response
   */
  formatAction(action) {
    return {
      id: action.id,
      actionType: action.action_type,
      agentId: action.agent_id,
      priority: action.priority,
      status: action.status,
      results: action.results,
      createdAt: action.created_at,
      updatedAt: action.updated_at
    };
  },

  /**
   * Check if action is expired
   */
  isExpired(action) {
    if (!action.expires_at) {
      return false;
    }

    return new Date(action.expires_at) < new Date();
  },

  /**
   * Check if action is scheduled for future
   */
  isScheduled(action) {
    if (!action.scheduled_at) {
      return false;
    }

    return new Date(action.scheduled_at) > new Date();
  },

  /**
   * Get action type display name
   */
  getActionTypeDisplay(actionType) {
    const displayNames = {
      [ACTION_TYPES.CREATE_LEAD]: 'Create Lead',
      [ACTION_TYPES.UPDATE_LEAD]: 'Update Lead',
      [ACTION_TYPES.QUALIFY_LEAD]: 'Qualify Lead',
      [ACTION_TYPES.SCORE_LEAD]: 'Score Lead',
      [ACTION_TYPES.SEND_EMAIL]: 'Send Email',
      [ACTION_TYPES.SCHEDULE_CALL]: 'Schedule Call',
      [ACTION_TYPES.SEND_MESSAGE]: 'Send Message',
      [ACTION_TYPES.ANALYZE_COMPANY]: 'Analyze Company',
      [ACTION_TYPES.RESEARCH_CONTACT]: 'Research Contact',
      [ACTION_TYPES.SENTIMENT_ANALYSIS]: 'Sentiment Analysis',
      [ACTION_TYPES.TRIGGER_WORKFLOW]: 'Trigger Workflow',
      [ACTION_TYPES.UPDATE_PIPELINE]: 'Update Pipeline',
      [ACTION_TYPES.CREATE_TASK]: 'Create Task',
      [ACTION_TYPES.HEALTH_CHECK]: 'Health Check',
      [ACTION_TYPES.LOG_EVENT]: 'Log Event'
    };

    return displayNames[actionType] || actionType;
  },

  /**
   * Get status display name
   */
  getStatusDisplay(status) {
    const displayNames = {
      [ACTION_STATUS.PENDING]: 'Pending',
      [ACTION_STATUS.PROCESSING]: 'Processing',
      [ACTION_STATUS.COMPLETED]: 'Completed',
      [ACTION_STATUS.FAILED]: 'Failed',
      [ACTION_STATUS.CANCELLED]: 'Cancelled'
    };

    return displayNames[status] || status;
  }
};

export default {
  ACTION_TYPES,
  ACTION_STATUS,
  ACTION_PRIORITY,
  agentActionSchemas,
  agentActionHelpers
};