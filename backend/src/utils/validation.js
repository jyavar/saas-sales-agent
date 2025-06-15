/**
 * Enhanced validation utilities with Zod
 */

import { z } from 'zod';

/**
 * Validate data against a Zod schema
 */
export function validateData(data, schema) {
  try {
    const result = schema.parse(data);
    return {
      success: true,
      data: result,
      errors: []
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code
      }));
      
      return {
        success: false,
        data: null,
        errors
      };
    }
    
    return {
      success: false,
      data: null,
      errors: [{ field: 'unknown', message: error.message }]
    };
  }
}

/**
 * Common validation schemas
 */
export const commonSchemas = {
  email: z.string().email('Invalid email format'),
  
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long'),
  
  uuid: z.string().uuid('Invalid UUID format'),
  
  url: z.string().url('Invalid URL format'),
  
  slug: z.string()
    .min(1, 'Slug required')
    .max(50, 'Slug too long')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  
  phone: z.string()
    .regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number format')
    .optional(),
  
  name: z.string()
    .min(1, 'Name required')
    .max(100, 'Name too long')
    .trim(),
  
  description: z.string()
    .max(1000, 'Description too long')
    .optional(),
  
  tags: z.array(z.string().min(1).max(50)).max(10, 'Too many tags').optional(),
  
  metadata: z.record(z.any()).optional()
};

/**
 * Pagination schema
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().optional(),
  filters: z.record(z.any()).optional()
});

// Lead validation schemas (refactor para evitar ciclo)
const leadCreateSchema = z.object({
  email: commonSchemas.email,
  firstName: commonSchemas.name,
  lastName: commonSchemas.name,
  company: z.string().max(100).optional(),
  jobTitle: z.string().max(100).optional(),
  phone: commonSchemas.phone,
  website: commonSchemas.url.optional(),
  linkedinUrl: commonSchemas.url.optional(),
  source: z.enum(['website', 'social_media', 'email_campaign', 'referral', 'ai_agent', 'manual', 'api']).default('manual'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  tags: commonSchemas.tags,
  customFields: commonSchemas.metadata,
  qualificationNotes: commonSchemas.description
});

const leadUpdateSchema = z.object({
  firstName: commonSchemas.name.optional(),
  lastName: commonSchemas.name.optional(),
  company: z.string().max(100).optional(),
  jobTitle: z.string().max(100).optional(),
  phone: commonSchemas.phone,
  website: commonSchemas.url.optional(),
  linkedinUrl: commonSchemas.url.optional(),
  status: z.enum(['new', 'contacted', 'qualified', 'converted', 'lost', 'nurturing']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  score: z.number().int().min(0).max(100).optional(),
  tags: commonSchemas.tags,
  customFields: commonSchemas.metadata,
  qualificationNotes: commonSchemas.description,
  nextFollowUpAt: z.string().datetime().optional()
});

const leadBulkCreateSchema = z.object({
  leads: z.array(leadCreateSchema).min(1, 'At least one lead required').max(100, 'Too many leads')
});

export const leadSchemas = {
  create: leadCreateSchema,
  update: leadUpdateSchema,
  bulkCreate: leadBulkCreateSchema
};

/**
 * Agent action validation schemas
 */
export const agentActionSchemas = {
  create: z.object({
    actionType: z.enum([
      'create_lead', 'update_lead', 'qualify_lead', 'score_lead',
      'send_email', 'schedule_call', 'send_message',
      'analyze_company', 'research_contact', 'sentiment_analysis',
      'trigger_workflow', 'update_pipeline', 'create_task',
      'generate_report', 'update_metrics',
      'health_check', 'log_event'
    ]),
    agentId: z.string().min(1, 'Agent ID required'),
    agentName: z.string().optional(),
    agentVersion: z.string().optional(),
    priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
    targetType: z.enum(['lead', 'campaign', 'workflow', 'system', 'report']).optional(),
    targetId: commonSchemas.uuid.optional(),
    payload: z.record(z.any()),
    context: z.record(z.any()).optional(),
    scheduledAt: z.string().datetime().optional(),
    expiresAt: z.string().datetime().optional()
  }),

  update: z.object({
    status: z.enum(['pending', 'processing', 'completed', 'failed', 'cancelled']).optional(),
    results: z.record(z.any()).optional(),
    error: z.string().optional()
  })
};

/**
 * Campaign validation schemas
 */
export const campaignSchemas = {
  create: z.object({
    name: z.string().min(1, 'Campaign name required').max(100, 'Name too long'),
    subject: z.string().min(1, 'Email subject required').max(200, 'Subject too long'),
    body: z.string().min(1, 'Email body required'),
    templateId: commonSchemas.uuid.optional(),
    leadIds: z.array(commonSchemas.uuid).min(1, 'At least one lead required'),
    scheduleAt: z.string().datetime().optional(),
    metadata: commonSchemas.metadata
  }),

  update: z.object({
    name: z.string().min(1).max(100).optional(),
    subject: z.string().min(1).max(200).optional(),
    body: z.string().min(1).optional(),
    scheduleAt: z.string().datetime().optional(),
    metadata: commonSchemas.metadata
  })
};

/**
 * Repository analysis schemas
 */
export const repositorySchemas = {
  analyze: z.object({
    url: z.string()
      .url('Invalid URL')
      .regex(/github\.com\/[\w\-\.]+\/[\w\-\.]+/, 'Must be a valid GitHub repository URL'),
    branch: z.string().default('main')
  })
};

/**
 * Webhook validation schemas
 */
export const webhookSchemas = {
  stripe: z.object({
    id: z.string(),
    type: z.string(),
    data: z.object({
      object: z.record(z.any())
    }),
    created: z.number()
  }),

  resend: z.object({
    id: z.string(),
    type: z.string(),
    data: z.record(z.any()),
    created_at: z.string()
  }),

  github: z.object({
    action: z.string().optional(),
    repository: z.object({
      full_name: z.string(),
      html_url: z.string()
    }),
    ref: z.string().optional(),
    commits: z.array(z.record(z.any())).optional()
  })
};

/**
 * Validate query parameters
 */
export function validateQueryParams(query, schema = paginationSchema) {
  return validateData(query, schema);
}

/**
 * Validate request body
 */
export function validateRequestBody(body, schema) {
  return validateData(body, schema);
}

/**
 * Validate URL parameters
 */
export function validateUrlParams(params, schema) {
  return validateData(params, schema);
}

/**
 * Create custom validation middleware
 */
export function createValidationMiddleware(schema, source = 'body') {
  return (req, res, next) => {
    const data = source === 'body' ? req.body : 
                 source === 'query' ? req.query : 
                 source === 'params' ? req.params : req[source];

    const validation = validateData(data, schema);
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: validation.errors
        },
        timestamp: new Date().toISOString(),
        requestId: req.id
      });
    }

    // Add validated data to request
    req.validated = req.validated || {};
    req.validated[source] = validation.data;

    next();
  };
}

export default {
  validateData,
  commonSchemas,
  paginationSchema,
  leadSchemas,
  agentActionSchemas,
  campaignSchemas,
  repositorySchemas,
  webhookSchemas,
  validateQueryParams,
  validateRequestBody,
  validateUrlParams,
  createValidationMiddleware
};