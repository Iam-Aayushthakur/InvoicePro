import { z } from 'zod';

export const purchaseSchema = z.object({
  supplierId: z.string().uuid(),
  totalAmount: z.number().positive(),
});
