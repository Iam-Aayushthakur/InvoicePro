import { z } from 'zod';

export const companySchema = z.object({
  name: z.string().min(2),
  gstin: z.string().length(15).optional(),
  email: z.string().email(),
  phone: z.string().min(10),
  address: z.string().min(5),
  stateCode: z.string().length(2),
});
