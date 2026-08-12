import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2),
  sku: z.string().min(2),
  hsnCode: z.string().min(4),
  price: z.number().positive(),
  taxRate: z.number().nonnegative(),
  stockQuantity: z.number().int().nonnegative(),
});
