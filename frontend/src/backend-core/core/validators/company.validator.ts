// Company input validation schemas
// Used by controllers to validate and sanitize incoming request payloads

import type { CreateCompanyInput, UpdateCompanyInput } from '../types/company.types.js';

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: string[];
}

const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const VALID_BUSINESS_TYPES = ['RETAIL', 'WHOLESALE', 'SERVICE', 'MANUFACTURING'];
const VALID_STATE_CODES = [
  '01','02','03','04','05','06','07','08','09','10',
  '11','12','13','14','15','16','17','18','19','20',
  '21','22','23','24','25','26','27','28','29','30',
  '31','32','33','34','35','36','37','38',
];

export function validateCreateCompany(body: unknown): ValidationResult<CreateCompanyInput> {
  const errors: string[] = [];
  const data = body as Record<string, unknown>;

  if (!data || typeof data !== 'object') {
    return { success: false, errors: ['Request body must be a JSON object'] };
  }

  // Required fields
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.push('name is required and must be at least 2 characters');
  }
  if (!data.email || typeof data.email !== 'string' || !data.email.includes('@')) {
    errors.push('email is required and must be a valid email address');
  }
  if (!data.phone || typeof data.phone !== 'string' || data.phone.trim().length < 10) {
    errors.push('phone is required and must be at least 10 digits');
  }
  if (!data.address || typeof data.address !== 'string') {
    errors.push('address is required');
  }
  if (!data.city || typeof data.city !== 'string') {
    errors.push('city is required');
  }
  if (!data.state || typeof data.state !== 'string') {
    errors.push('state is required');
  }
  if (!data.postal_code || typeof data.postal_code !== 'string') {
    errors.push('postal_code is required');
  }
  if (!data.state_code || typeof data.state_code !== 'string') {
    errors.push('state_code is required');
  } else if (!VALID_STATE_CODES.includes(data.state_code as string)) {
    errors.push(`state_code must be a valid 2-digit Indian GST state code`);
  }

  // Optional field validation
  if (data.business_type && !VALID_BUSINESS_TYPES.includes(data.business_type as string)) {
    errors.push(`business_type must be one of: ${VALID_BUSINESS_TYPES.join(', ')}`);
  }
  if (data.gstin && (typeof data.gstin !== 'string' || !GSTIN_REGEX.test(data.gstin))) {
    errors.push('gstin must be a valid 15-character GSTIN');
  }
  if (data.pan && (typeof data.pan !== 'string' || !PAN_REGEX.test(data.pan))) {
    errors.push('pan must be a valid 10-character PAN');
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      name: (data.name as string).trim(),
      legal_name: data.legal_name ? (data.legal_name as string).trim() : undefined,
      business_type: (data.business_type as string) || 'RETAIL',
      email: (data.email as string).trim().toLowerCase(),
      phone: (data.phone as string).trim(),
      address: (data.address as string).trim(),
      city: (data.city as string).trim(),
      state: (data.state as string).trim(),
      country: (data.country as string) || 'India',
      postal_code: (data.postal_code as string).trim(),
      state_code: (data.state_code as string).trim(),
      gstin: data.gstin ? (data.gstin as string).trim().toUpperCase() : undefined,
      pan: data.pan ? (data.pan as string).trim().toUpperCase() : undefined,
      currency: (data.currency as string) || 'INR',
      timezone: (data.timezone as string) || 'Asia/Kolkata',
    },
  };
}

export function validateUpdateCompany(body: unknown): ValidationResult<UpdateCompanyInput> {
  const errors: string[] = [];
  const data = body as Record<string, unknown>;

  if (!data || typeof data !== 'object') {
    return { success: false, errors: ['Request body must be a JSON object'] };
  }

  // At least one field must be provided
  const allowedFields = [
    'name', 'legal_name', 'business_type', 'email', 'phone',
    'address', 'city', 'state', 'country', 'postal_code',
    'state_code', 'gstin', 'pan', 'currency', 'timezone', 'logo_url',
  ];
  const providedFields = Object.keys(data).filter((k) => allowedFields.includes(k));
  if (providedFields.length === 0) {
    return { success: false, errors: ['At least one updatable field must be provided'] };
  }

  // Validate individual fields if present
  if (data.name !== undefined && (typeof data.name !== 'string' || data.name.trim().length < 2)) {
    errors.push('name must be at least 2 characters');
  }
  if (data.email !== undefined && (typeof data.email !== 'string' || !data.email.includes('@'))) {
    errors.push('email must be a valid email address');
  }
  if (data.business_type !== undefined && !VALID_BUSINESS_TYPES.includes(data.business_type as string)) {
    errors.push(`business_type must be one of: ${VALID_BUSINESS_TYPES.join(', ')}`);
  }
  if (data.state_code !== undefined) {
    if (typeof data.state_code !== 'string' || !VALID_STATE_CODES.includes(data.state_code)) {
      errors.push('state_code must be a valid 2-digit Indian GST state code');
    }
  }
  if (data.gstin !== undefined && data.gstin !== null) {
    if (typeof data.gstin !== 'string' || !GSTIN_REGEX.test(data.gstin)) {
      errors.push('gstin must be a valid 15-character GSTIN');
    }
  }
  if (data.pan !== undefined && data.pan !== null) {
    if (typeof data.pan !== 'string' || !PAN_REGEX.test(data.pan)) {
      errors.push('pan must be a valid 10-character PAN');
    }
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  const result: UpdateCompanyInput = {};
  if (data.name !== undefined) result.name = (data.name as string).trim();
  if (data.legal_name !== undefined) result.legal_name = data.legal_name ? (data.legal_name as string).trim() : undefined;
  if (data.business_type !== undefined) result.business_type = data.business_type as string;
  if (data.email !== undefined) result.email = (data.email as string).trim().toLowerCase();
  if (data.phone !== undefined) result.phone = (data.phone as string).trim();
  if (data.address !== undefined) result.address = (data.address as string).trim();
  if (data.city !== undefined) result.city = (data.city as string).trim();
  if (data.state !== undefined) result.state = (data.state as string).trim();
  if (data.country !== undefined) result.country = (data.country as string).trim();
  if (data.postal_code !== undefined) result.postal_code = (data.postal_code as string).trim();
  if (data.state_code !== undefined) result.state_code = (data.state_code as string).trim();
  if (data.gstin !== undefined) result.gstin = data.gstin ? (data.gstin as string).trim().toUpperCase() : undefined;
  if (data.pan !== undefined) result.pan = data.pan ? (data.pan as string).trim().toUpperCase() : undefined;
  if (data.currency !== undefined) result.currency = (data.currency as string).trim();
  if (data.timezone !== undefined) result.timezone = (data.timezone as string).trim();
  if (data.logo_url !== undefined) result.logo_url = data.logo_url ? (data.logo_url as string).trim() : undefined;

  return { success: true, data: result };
}
