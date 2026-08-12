import { z } from 'zod';

export const supplierSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
  gstin: z.string().length(15).optional(),
  address: z.string().min(5),
});
