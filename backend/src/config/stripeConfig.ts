import { z } from 'zod';

const stripeConfigSchema = z.object({
  STRIPE_SECRET_KEY: z.string().min(10, 'STRIPE_SECRET_KEY is required and must be valid'),
  STRIPE_WEBHOOK_SECRET: z.string().min(10, 'STRIPE_WEBHOOK_SECRET is required and must be valid'),
});

const stripeConfig = stripeConfigSchema.parse({
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
});

export const STRIPE_SECRET_KEY = stripeConfig.STRIPE_SECRET_KEY;
export const STRIPE_WEBHOOK_SECRET = stripeConfig.STRIPE_WEBHOOK_SECRET; 