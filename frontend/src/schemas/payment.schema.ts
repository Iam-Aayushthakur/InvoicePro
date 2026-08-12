import { z } from 'zod';

export const paymentSchema = z.object({
  invoiceId: z.string().uuid().optional(),
  amount: z.number().positive(),
  provider: z.enum(['RAZORPAY', 'STRIPE', 'CASH', 'BANK_TRANSFER']),
});
