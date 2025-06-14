/**
 * Lead model and validation schemas
 */

import { z } from 'zod';

// Lead status constants
export const LEAD_STATUS = {
  NEW: 'new',
  CONTACTED: 'contacted',
  QUALIFIED: 'qualified',
  CONVERTED: 'converted',
  LOST: 'lost',
  NURTURING: 'nurturing'
};

// Lead source constants
export const LEAD_SOURCE = {
  WEBSITE: 'website',
  SOCIAL_MEDIA: 'social_media',
  EMAIL_CAMPAIGN: 'email_campaign',
  REFERRAL: 'referral',
  AI_AGENT: 'ai_agent',
  MANUAL: 'manual',
  API: 'api'
};

// Lead priority constants
export const LEAD_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

// Validation schemas
export const leadSchemas = {
  create: z.object({
    email: z.string().email('Valid email required'),
    firstName: z.string().min(1, 'First name required').max(100, 'First name too long'),
    lastName: z.string().min(1, 'Last name required').max(100, 'Last name too long'),
    company: z.string().max(100, 'Company name too long').optional(),
    jobTitle: z.string().max(100, 'Job title too long').optional(),
    phone: z.string().max(20, 'Phone number too long').optional(),
    website: z.string().url('Valid URL required').optional(),
    linkedinUrl: z.string().url('Valid URL required').optional(),
    source: z.enum(Object.values(LEAD_SOURCE)).default(LEAD_SOURCE.MANUAL),
    priority: z.enum(Object.values(LEAD_PRIORITY)).default(LEAD_PRIORITY.MEDIUM),
    tags: z.array(z.string()).max(10, 'Too many tags').optional(),
    customFields: z.record(z.any()).optional(),
    qualificationNotes: z.string().max(1000, 'Notes too long').optional()
  }),

  update: z.object({
    firstName: z.string().min(1).max(100).optional(),
    lastName: z.string().min(1).max(100).optional(),
    company: z.string().max(100).optional(),
    jobTitle: z.string().max(100).optional(),
    phone: z.string().max(20).optional(),
    website: z.string().url().optional(),
    linkedinUrl: z.string().url().optional(),
    status: z.enum(Object.values(LEAD_STATUS)).optional(),
    priority: z.enum(Object.values(LEAD_PRIORITY)).optional(),
    score: z.number().int().min(0).max(100).optional(),
    tags: z.array(z.string()).max(10).optional(),
    customFields: z.record(z.any()).optional(),
    qualificationNotes: z.string().max(1000).optional(),
    nextFollowUpAt: z.string().datetime().optional()
  }),

  bulkCreate: z.object({
    leads: z.array(z.object({
      email: z.string().email('Valid email required'),
      firstName: z.string().min(1, 'First name required').max(100, 'First name too long'),
      lastName: z.string().min(1, 'Last name required').max(100, 'Last name too long'),
      company: z.string().max(100).optional(),
      jobTitle: z.string().max(100).optional(),
      phone: z.string().max(20).optional(),
      website: z.string().url().optional(),
      linkedinUrl: z.string().url().optional(),
      source: z.enum(Object.values(LEAD_SOURCE)).default(LEAD_SOURCE.MANUAL),
      priority: z.enum(Object.values(LEAD_PRIORITY)).default(LEAD_PRIORITY.MEDIUM),
      tags: z.array(z.string()).max(10).optional(),
      customFields: z.record(z.any()).optional(),
      qualificationNotes: z.string().max(1000).optional()
    })).min(1, 'At least one lead required').max(100, 'Too many leads')
  })
};

// Lead helper functions
export const leadHelpers = {
  /**
   * Format lead for API response
   */
  formatLead(lead) {
    return {
      id: lead.id,
      email: lead.email,
      firstName: lead.first_name,
      lastName: lead.last_name,
      company: lead.company,
      jobTitle: lead.job_title,
      phone: lead.phone,
      website: lead.website,
      linkedinUrl: lead.linkedin_url,
      status: lead.status,
      source: lead.source,
      priority: lead.priority,
      score: lead.score,
      tags: lead.tags,
      customFields: lead.custom_fields,
      qualificationNotes: lead.qualification_notes,
      lastContactedAt: lead.last_contacted_at,
      nextFollowUpAt: lead.next_follow_up_at,
      createdAt: lead.created_at,
      updatedAt: lead.updated_at
    };
  },

  /**
   * Get full name
   */
  getFullName(lead) {
    return `${lead.first_name} ${lead.last_name}`;
  },

  /**
   * Get status display name
   */
  getStatusDisplay(status) {
    const displayNames = {
      [LEAD_STATUS.NEW]: 'New',
      [LEAD_STATUS.CONTACTED]: 'Contacted',
      [LEAD_STATUS.QUALIFIED]: 'Qualified',
      [LEAD_STATUS.CONVERTED]: 'Converted',
      [LEAD_STATUS.LOST]: 'Lost',
      [LEAD_STATUS.NURTURING]: 'Nurturing'
    };

    return displayNames[status] || status;
  },

  /**
   * Get source display name
   */
  getSourceDisplay(source) {
    const displayNames = {
      [LEAD_SOURCE.WEBSITE]: 'Website',
      [LEAD_SOURCE.SOCIAL_MEDIA]: 'Social Media',
      [LEAD_SOURCE.EMAIL_CAMPAIGN]: 'Email Campaign',
      [LEAD_SOURCE.REFERRAL]: 'Referral',
      [LEAD_SOURCE.AI_AGENT]: 'AI Agent',
      [LEAD_SOURCE.MANUAL]: 'Manual',
      [LEAD_SOURCE.API]: 'API'
    };

    return displayNames[source] || source;
  },

  /**
   * Get priority display name
   */
  getPriorityDisplay(priority) {
    const displayNames = {
      [LEAD_PRIORITY.LOW]: 'Low',
      [LEAD_PRIORITY.MEDIUM]: 'Medium',
      [LEAD_PRIORITY.HIGH]: 'High',
      [LEAD_PRIORITY.URGENT]: 'Urgent'
    };

    return displayNames[priority] || priority;
  },

  /**
   * Get priority color
   */
  getPriorityColor(priority) {
    const colors = {
      [LEAD_PRIORITY.LOW]: 'gray',
      [LEAD_PRIORITY.MEDIUM]: 'blue',
      [LEAD_PRIORITY.HIGH]: 'orange',
      [LEAD_PRIORITY.URGENT]: 'red'
    };

    return colors[priority] || 'gray';
  },

  /**
   * Get status color
   */
  getStatusColor(status) {
    const colors = {
      [LEAD_STATUS.NEW]: 'blue',
      [LEAD_STATUS.CONTACTED]: 'purple',
      [LEAD_STATUS.QUALIFIED]: 'green',
      [LEAD_STATUS.CONVERTED]: 'emerald',
      [LEAD_STATUS.LOST]: 'red',
      [LEAD_STATUS.NURTURING]: 'amber'
    };

    return colors[status] || 'gray';
  },

  /**
   * Calculate lead score based on attributes
   */
  calculateScore(lead) {
    let score = 0;

    // Basic info completeness (max 20 points)
    if (lead.email) score += 5;
    if (lead.phone) score += 5;
    if (lead.company) score += 5;
    if (lead.jobTitle) score += 5;

    // Priority (max 30 points)
    if (lead.priority === LEAD_PRIORITY.URGENT) score += 30;
    else if (lead.priority === LEAD_PRIORITY.HIGH) score += 20;
    else if (lead.priority === LEAD_PRIORITY.MEDIUM) score += 10;

    // Status (max 30 points)
    if (lead.status === LEAD_STATUS.QUALIFIED) score += 30;
    else if (lead.status === LEAD_STATUS.CONTACTED) score += 20;
    else if (lead.status === LEAD_STATUS.NEW) score += 10;

    // Source (max 20 points)
    if (lead.source === LEAD_SOURCE.REFERRAL) score += 20;
    else if (lead.source === LEAD_SOURCE.WEBSITE) score += 15;
    else if (lead.source === LEAD_SOURCE.EMAIL_CAMPAIGN) score += 10;
    else score += 5;

    return Math.min(score, 100);
  }
};

export default {
  LEAD_STATUS,
  LEAD_SOURCE,
  LEAD_PRIORITY,
  leadSchemas,
  leadHelpers
};