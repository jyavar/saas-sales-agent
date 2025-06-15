import { z } from 'zod';

export const campaignSchemas = {
  create: z.object({
    name: z.string().min(2),
    repoUrl: z.string().url(),
    tenantId: z.string().min(2),
    presetKey: z.string().optional(),
  }),
  update: z.object({
    name: z.string().min(2).optional(),
    subject: z.string().optional(),
    content: z.string().optional(),
    status: z.enum(['draft', 'active', 'paused', 'completed']).optional(),
    // Puedes agregar más campos según el modelo de campaña
  }),
}; 