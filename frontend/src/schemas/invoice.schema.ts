import { z } from 'zod';

export const invoiceItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
  taxRate: z.number().nonnegative(),
});

export const invoiceSchema = z.object({
  customerId: z.string().uuid(),
  items: z.array(invoiceItemSchema).min(1),
});
