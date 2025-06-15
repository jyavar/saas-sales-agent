"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STRIPE_WEBHOOK_SECRET = exports.STRIPE_SECRET_KEY = void 0;
const zod_1 = require("zod");
const stripeConfigSchema = zod_1.z.object({
    STRIPE_SECRET_KEY: zod_1.z.string().min(10, 'STRIPE_SECRET_KEY is required and must be valid'),
    STRIPE_WEBHOOK_SECRET: zod_1.z.string().min(10, 'STRIPE_WEBHOOK_SECRET is required and must be valid'),
});
const stripeConfig = stripeConfigSchema.parse({
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
});
exports.STRIPE_SECRET_KEY = stripeConfig.STRIPE_SECRET_KEY;
exports.STRIPE_WEBHOOK_SECRET = stripeConfig.STRIPE_WEBHOOK_SECRET;
