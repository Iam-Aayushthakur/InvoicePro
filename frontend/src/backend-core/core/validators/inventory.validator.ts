import type { RecordTransactionInput } from '../types/inventory.types.js';

export interface ValidationResult<T> { success: boolean; data?: T; errors?: string[]; }

const VALID_TX_TYPES = ['OPENING', 'PURCHASE', 'SALE', 'SALE_RETURN', 'PURCHASE_RETURN', 'ADJUSTMENT', 'DAMAGE', 'TRANSFER'];

export function validateRecordTransaction(body: unknown): ValidationResult<RecordTransactionInput> {
  const errors: string[] = [];
  const data = body as Record<string, unknown>;

  if (!data || typeof data !== 'object') return { success: false, errors: ['Request body must be a JSON object'] };
  
  if (!data.product_id || typeof data.product_id !== 'string') errors.push('product_id is required');
  if (!data.transaction_type || !VALID_TX_TYPES.includes(data.transaction_type as string)) {
    errors.push(`transaction_type must be one of: ${VALID_TX_TYPES.join(', ')}`);
  }
  if (typeof data.quantity !== 'number' || data.quantity === 0) errors.push('quantity must be a non-zero number');
  
  if (errors.length > 0) return { success: false, errors };

  return {
    success: true,
    data: {
      product_id: data.product_id as string,
      transaction_type: data.transaction_type as RecordTransactionInput['transaction_type'],
      quantity: data.quantity as number,
      reference_type: data.reference_type ? (data.reference_type as string).trim() : undefined,
      reference_id: data.reference_id ? (data.reference_id as string).trim() : undefined,
      notes: data.notes ? (data.notes as string).trim() : undefined,
    }
  };
}
