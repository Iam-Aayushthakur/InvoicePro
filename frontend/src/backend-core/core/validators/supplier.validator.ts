import type { CreateSupplierInput, UpdateSupplierInput } from '../types/supplier.types.js';

export interface ValidationResult<T> { success: boolean; data?: T; errors?: string[]; }

const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

export function validateCreateSupplier(body: unknown): ValidationResult<CreateSupplierInput> {
  const errors: string[] = [];
  const data = body as Record<string, unknown>;

  if (!data || typeof data !== 'object') return { success: false, errors: ['Request body must be a JSON object'] };
  
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) errors.push('name is required and must be at least 2 characters');
  if (!data.address || typeof data.address !== 'string') errors.push('address is required');
  if (data.email && (typeof data.email !== 'string' || !data.email.includes('@'))) errors.push('email must be valid');
  if (data.gstin && (typeof data.gstin !== 'string' || !GSTIN_REGEX.test(data.gstin))) errors.push('gstin must be a valid 15-character GSTIN');
  if (data.pan && (typeof data.pan !== 'string' || !PAN_REGEX.test(data.pan))) errors.push('pan must be a valid 10-character PAN');
  
  if (errors.length > 0) return { success: false, errors };

  return {
    success: true,
    data: {
      name: (data.name as string).trim(),
      business_name: data.business_name ? (data.business_name as string).trim() : undefined,
      email: data.email ? (data.email as string).trim().toLowerCase() : undefined,
      phone: data.phone ? (data.phone as string).trim() : undefined,
      address: (data.address as string).trim(),
      city: data.city ? (data.city as string).trim() : undefined,
      state: data.state ? (data.state as string).trim() : undefined,
      postal_code: data.postal_code ? (data.postal_code as string).trim() : undefined,
      country: data.country ? (data.country as string).trim() : 'India',
      gstin: data.gstin ? (data.gstin as string).trim().toUpperCase() : undefined,
      pan: data.pan ? (data.pan as string).trim().toUpperCase() : undefined,
      opening_balance: typeof data.opening_balance === 'number' ? data.opening_balance : 0,
      notes: data.notes ? (data.notes as string).trim() : undefined,
    }
  };
}

export function validateUpdateSupplier(body: unknown): ValidationResult<UpdateSupplierInput> {
  const r = validateCreateSupplier({ ...body, name: 'dummy', address: 'dummy' });
  if (!r.success) {
    const e = r.errors?.filter(x => !x.includes('required'));
    if (e && e.length > 0) return { success: false, errors: e };
  }
  
  const data = body as Record<string, unknown>;
  const result: UpdateSupplierInput = {};
  if (data.name) result.name = (data.name as string).trim();
  if (data.business_name !== undefined) result.business_name = data.business_name ? (data.business_name as string).trim() : undefined;
  if (data.email !== undefined) result.email = data.email ? (data.email as string).trim().toLowerCase() : undefined;
  if (data.phone !== undefined) result.phone = data.phone ? (data.phone as string).trim() : undefined;
  if (data.address !== undefined) result.address = data.address ? (data.address as string).trim() : undefined;
  if (data.city !== undefined) result.city = data.city ? (data.city as string).trim() : undefined;
  if (data.state !== undefined) result.state = data.state ? (data.state as string).trim() : undefined;
  if (data.postal_code !== undefined) result.postal_code = data.postal_code ? (data.postal_code as string).trim() : undefined;
  if (data.country !== undefined) result.country = data.country ? (data.country as string).trim() : undefined;
  if (data.gstin !== undefined) result.gstin = data.gstin ? (data.gstin as string).trim().toUpperCase() : undefined;
  if (data.pan !== undefined) result.pan = data.pan ? (data.pan as string).trim().toUpperCase() : undefined;
  if (data.notes !== undefined) result.notes = data.notes ? (data.notes as string).trim() : undefined;
  
  return { success: true, data: result };
}
