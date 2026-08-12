import { z } from 'zod';

export const customerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
  gstin: z.string().length(15).optional(),
  billingAddress: z.string().min(5),
  shippingAddress: z.string().optional(),
});
