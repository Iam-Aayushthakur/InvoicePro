import { z } from 'zod';

export const subscriptionSchema = z.object({
  plan: z.enum(['FREE', 'STARTER', 'PRO', 'BUSINESS', 'ENTERPRISE']),
  billingInterval: z.enum(['MONTHLY', 'YEARLY']),
});
