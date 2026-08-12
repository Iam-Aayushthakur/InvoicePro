import type { CreatePaymentInput } from '../types/payment.types.js';

export interface ValidationResult<T> { success: boolean; data?: T; errors?: string[]; }

const VALID_METHODS = ['RAZORPAY', 'STRIPE', 'CASH', 'BANK_TRANSFER', 'CHEQUE', 'UPI'];
const VALID_STATUSES = ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'];

export function validateCreatePayment(body: unknown): ValidationResult<CreatePaymentInput> {
  const errors: string[] = [];
  const data = body as Record<string, unknown>;

  if (!data || typeof data !== 'object') return { success: false, errors: ['Request body must be a JSON object'] };
  
  if (!data.customer_id && !data.supplier_id) errors.push('Either customer_id or supplier_id is required');
  if (typeof data.amount !== 'number' || data.amount <= 0) errors.push('amount must be a positive number');
  
  if (!data.payment_method || !VALID_METHODS.includes(data.payment_method as string)) {
    errors.push(`payment_method must be one of: ${VALID_METHODS.join(', ')}`);
  }

  if (data.status && !VALID_STATUSES.includes(data.status as string)) {
    errors.push(`status must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  if (errors.length > 0) return { success: false, errors };

  return {
    success: true,
    data: {
      customer_id: data.customer_id ? data.customer_id as string : undefined,
      supplier_id: data.supplier_id ? data.supplier_id as string : undefined,
      invoice_id: data.invoice_id ? data.invoice_id as string : undefined,
      purchase_id: data.purchase_id ? data.purchase_id as string : undefined,
      amount: data.amount as number,
      payment_method: data.payment_method as string,
      payment_date: data.payment_date ? data.payment_date as string : undefined,
      reference_number: data.reference_number ? data.reference_number as string : undefined,
      status: data.status as any || 'SUCCESS',
      notes: data.notes ? data.notes as string : undefined,
    }
  };
}
