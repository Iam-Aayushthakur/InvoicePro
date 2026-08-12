import type { CreateProductInput, UpdateProductInput } from '../types/product.types.js';

export interface ValidationResult<T> { success: boolean; data?: T; errors?: string[]; }

const VALID_UNITS = ['PCS', 'KG', 'LTR', 'BOX', 'MTR', 'HOURS'];
const VALID_TAX_RATES = [0, 5, 12, 18, 28];

export function validateCreateProduct(body: unknown): ValidationResult<CreateProductInput> {
  const errors: string[] = [];
  const data = body as Record<string, unknown>;

  if (!data || typeof data !== 'object') return { success: false, errors: ['Request body must be a JSON object'] };
  
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) errors.push('name is required and must be at least 2 characters');
  if (!data.sku || typeof data.sku !== 'string' || data.sku.trim().length < 2) errors.push('sku is required');
  if (data.unit && !VALID_UNITS.includes(data.unit as string)) errors.push(`unit must be one of: ${VALID_UNITS.join(', ')}`);
  if (data.tax_rate !== undefined && typeof data.tax_rate === 'number' && !VALID_TAX_RATES.includes(data.tax_rate)) errors.push(`tax_rate must be one of: ${VALID_TAX_RATES.join(', ')}`);
  
  if (errors.length > 0) return { success: false, errors };

  return {
    success: true,
    data: {
      category_id: data.category_id ? (data.category_id as string).trim() : undefined,
      name: (data.name as string).trim(),
      sku: (data.sku as string).trim().toUpperCase(),
      barcode: data.barcode ? (data.barcode as string).trim() : undefined,
      description: data.description ? (data.description as string).trim() : undefined,
      unit: (data.unit as string || 'PCS').toUpperCase(),
      purchase_price: typeof data.purchase_price === 'number' ? data.purchase_price : 0,
      selling_price: typeof data.selling_price === 'number' ? data.selling_price : 0,
      tax_rate: typeof data.tax_rate === 'number' ? data.tax_rate : 18,
      hsn_sac: data.hsn_sac ? (data.hsn_sac as string).trim() : undefined,
      track_inventory: typeof data.track_inventory === 'boolean' ? data.track_inventory : true,
      minimum_stock: typeof data.minimum_stock === 'number' ? data.minimum_stock : 10,
    }
  };
}

export function validateUpdateProduct(body: unknown): ValidationResult<UpdateProductInput> {
  const data = body as Record<string, unknown>;
  const errors: string[] = [];
  const result: UpdateProductInput = {};

  if (!data || typeof data !== 'object') return { success: false, errors: ['Request body must be a JSON object'] };

  if (data.name !== undefined) {
    if (typeof data.name !== 'string' || data.name.trim().length < 2) errors.push('name must be at least 2 characters');
    else result.name = data.name.trim();
  }
  if (data.sku !== undefined) {
    if (typeof data.sku !== 'string' || data.sku.trim().length < 2) errors.push('sku must be at least 2 characters');
    else result.sku = data.sku.trim().toUpperCase();
  }
  if (data.unit !== undefined && !VALID_UNITS.includes(data.unit as string)) errors.push(`unit must be one of: ${VALID_UNITS.join(', ')}`);
  else if (data.unit) result.unit = (data.unit as string).toUpperCase();

  if (data.tax_rate !== undefined && typeof data.tax_rate === 'number' && !VALID_TAX_RATES.includes(data.tax_rate)) errors.push(`tax_rate must be one of: ${VALID_TAX_RATES.join(', ')}`);
  else if (data.tax_rate !== undefined) result.tax_rate = data.tax_rate as number;

  if (data.category_id !== undefined) result.category_id = data.category_id ? (data.category_id as string).trim() : undefined;
  if (data.barcode !== undefined) result.barcode = data.barcode ? (data.barcode as string).trim() : undefined;
  if (data.description !== undefined) result.description = data.description ? (data.description as string).trim() : undefined;
  if (data.purchase_price !== undefined) result.purchase_price = Number(data.purchase_price);
  if (data.selling_price !== undefined) result.selling_price = Number(data.selling_price);
  if (data.hsn_sac !== undefined) result.hsn_sac = data.hsn_sac ? (data.hsn_sac as string).trim() : undefined;
  if (data.track_inventory !== undefined) result.track_inventory = Boolean(data.track_inventory);
  if (data.minimum_stock !== undefined) result.minimum_stock = Number(data.minimum_stock);

  if (Object.keys(result).length === 0 && errors.length === 0) {
    errors.push('At least one updatable field must be provided');
  }

  if (errors.length > 0) return { success: false, errors };
  return { success: true, data: result };
}
