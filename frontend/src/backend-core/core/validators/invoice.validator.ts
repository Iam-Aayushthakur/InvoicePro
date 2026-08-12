import type { CreateInvoiceInput, UpdateInvoiceStatusInput, CreateInvoiceItemInput } from '../types/invoice.types.js';

export interface ValidationResult<T> { success: boolean; data?: T; errors?: string[]; }

const VALID_STATUSES = ['DRAFT', 'ISSUED', 'PAID', 'PARTIALLY_PAID', 'CANCELLED', 'OVERDUE'];

export function validateCreateInvoice(body: unknown): ValidationResult<CreateInvoiceInput> {
  const errors: string[] = [];
  const data = body as Record<string, unknown>;

  if (!data || typeof data !== 'object') return { success: false, errors: ['Request body must be a JSON object'] };
  
  if (!data.customer_id || typeof data.customer_id !== 'string') errors.push('customer_id is required');
  if (!data.invoice_number || typeof data.invoice_number !== 'string') errors.push('invoice_number is required');
  if (!data.due_date || typeof data.due_date !== 'string') errors.push('due_date is required');
  
  if (data.status && !VALID_STATUSES.includes(data.status as string)) {
    errors.push(`status must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  if (!Array.isArray(data.items) || data.items.length === 0) {
    errors.push('items array is required and cannot be empty');
  } else {
    data.items.forEach((item: any, index: number) => {
      if (!item.product_id || typeof item.product_id !== 'string') errors.push(`items[${index}].product_id is required`);
      if (typeof item.quantity !== 'number' || item.quantity <= 0) errors.push(`items[${index}].quantity must be > 0`);
      if (typeof item.unit_price !== 'number' || item.unit_price < 0) errors.push(`items[${index}].unit_price must be >= 0`);
    });
  }
  
  if (errors.length > 0) return { success: false, errors };

  return {
    success: true,
    data: {
      customer_id: data.customer_id as string,
      invoice_number: data.invoice_number as string,
      invoice_date: data.invoice_date ? data.invoice_date as string : undefined,
      due_date: data.due_date as string,
      status: data.status as any || 'DRAFT',
      notes: data.notes ? data.notes as string : undefined,
      terms: data.terms ? data.terms as string : undefined,
      items: data.items as CreateInvoiceItemInput[],
    }
  };
}

export function validateUpdateInvoiceStatus(body: unknown): ValidationResult<UpdateInvoiceStatusInput> {
  const data = body as Record<string, unknown>;
  if (!data || typeof data !== 'object') return { success: false, errors: ['Request body must be a JSON object'] };
  if (!data.status || !VALID_STATUSES.includes(data.status as string)) {
    return { success: false, errors: [`status must be one of: ${VALID_STATUSES.join(', ')}`] };
  }
  return { success: true, data: { status: data.status as any } };
}
