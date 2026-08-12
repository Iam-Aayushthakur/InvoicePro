import type { CreatePurchaseInput, UpdatePurchaseStatusInput, CreatePurchaseItemInput } from '../types/purchase.types.js';

export interface ValidationResult<T> { success: boolean; data?: T; errors?: string[]; }

const VALID_STATUSES = ['DRAFT', 'ORDERED', 'RECEIVED', 'PAID', 'CANCELLED'];

export function validateCreatePurchase(body: unknown): ValidationResult<CreatePurchaseInput> {
  const errors: string[] = [];
  const data = body as Record<string, unknown>;

  if (!data || typeof data !== 'object') return { success: false, errors: ['Request body must be a JSON object'] };
  
  if (!data.supplier_id || typeof data.supplier_id !== 'string') errors.push('supplier_id is required');
  if (!data.purchase_number || typeof data.purchase_number !== 'string') errors.push('purchase_number is required');
  
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
      supplier_id: data.supplier_id as string,
      purchase_number: data.purchase_number as string,
      purchase_date: data.purchase_date ? data.purchase_date as string : undefined,
      due_date: data.due_date ? data.due_date as string : undefined,
      status: data.status as any || 'ORDERED',
      notes: data.notes ? data.notes as string : undefined,
      items: data.items as CreatePurchaseItemInput[],
    }
  };
}

export function validateUpdatePurchaseStatus(body: unknown): ValidationResult<UpdatePurchaseStatusInput> {
  const data = body as Record<string, unknown>;
  if (!data || typeof data !== 'object') return { success: false, errors: ['Request body must be a JSON object'] };
  if (!data.status || !VALID_STATUSES.includes(data.status as string)) {
    return { success: false, errors: [`status must be one of: ${VALID_STATUSES.join(', ')}`] };
  }
  return { success: true, data: { status: data.status as any } };
}
