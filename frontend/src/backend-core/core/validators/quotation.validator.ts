import type { CreateQuotationInput, UpdateQuotationStatusInput, CreateQuotationItemInput } from '../types/quotation.types.js';

export interface ValidationResult<T> { success: boolean; data?: T; errors?: string[]; }

const VALID_STATUSES = ['DRAFT', 'SENT', 'ACCEPTED', 'DECLINED', 'CONVERTED'];

export function validateCreateQuotation(body: unknown): ValidationResult<CreateQuotationInput> {
  const errors: string[] = [];
  const data = body as Record<string, unknown>;

  if (!data || typeof data !== 'object') return { success: false, errors: ['Request body must be a JSON object'] };
  
  if (!data.customer_id || typeof data.customer_id !== 'string') errors.push('customer_id is required');
  if (!data.quotation_number || typeof data.quotation_number !== 'string') errors.push('quotation_number is required');
  
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
      quotation_number: data.quotation_number as string,
      quotation_date: data.quotation_date ? data.quotation_date as string : undefined,
      valid_until: data.valid_until ? data.valid_until as string : undefined,
      status: data.status as any || 'DRAFT',
      notes: data.notes ? data.notes as string : undefined,
      items: data.items as CreateQuotationItemInput[],
    }
  };
}

export function validateUpdateQuotationStatus(body: unknown): ValidationResult<UpdateQuotationStatusInput> {
  const data = body as Record<string, unknown>;
  if (!data || typeof data !== 'object') return { success: false, errors: ['Request body must be a JSON object'] };
  if (!data.status || !VALID_STATUSES.includes(data.status as string)) {
    return { success: false, errors: [`status must be one of: ${VALID_STATUSES.join(', ')}`] };
  }
  return { success: true, data: { status: data.status as any } };
}
