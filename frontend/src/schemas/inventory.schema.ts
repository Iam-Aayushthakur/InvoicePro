import { z } from 'zod';

export const inventoryTransactionSchema = z.object({
  productId: z.string().uuid(),
  type: z.enum(['IN', 'OUT', 'ADJUSTMENT']),
  quantity: z.number().int().positive(),
  reason: z.string().optional(),
});
