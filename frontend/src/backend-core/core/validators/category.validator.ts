import type { CreateCategoryInput, UpdateCategoryInput } from '../types/category.types.js';

export interface ValidationResult<T> { success: boolean; data?: T; errors?: string[]; }

export function validateCreateCategory(body: unknown): ValidationResult<CreateCategoryInput> {
  const errors: string[] = [];
  const data = body as Record<string, unknown>;

  if (!data || typeof data !== 'object') return { success: false, errors: ['Request body must be a JSON object'] };
  
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) errors.push('name is required and must be at least 2 characters');
  if (data.parent_id && typeof data.parent_id !== 'string') errors.push('parent_id must be a string');
  
  if (errors.length > 0) return { success: false, errors };

  return {
    success: true,
    data: {
      name: (data.name as string).trim(),
      description: data.description ? (data.description as string).trim() : undefined,
      parent_id: data.parent_id ? (data.parent_id as string).trim() : undefined,
    }
  };
}

export function validateUpdateCategory(body: unknown): ValidationResult<UpdateCategoryInput> {
  const data = body as Record<string, unknown>;
  const errors: string[] = [];
  const result: UpdateCategoryInput = {};

  if (!data || typeof data !== 'object') return { success: false, errors: ['Request body must be a JSON object'] };

  if (data.name !== undefined) {
    if (typeof data.name !== 'string' || data.name.trim().length < 2) errors.push('name must be at least 2 characters');
    else result.name = data.name.trim();
  }
  
  if (data.description !== undefined) {
    result.description = data.description ? (data.description as string).trim() : undefined;
  }
  
  if (data.parent_id !== undefined) {
    if (data.parent_id !== null && typeof data.parent_id !== 'string') errors.push('parent_id must be a string or null');
    else result.parent_id = data.parent_id ? (data.parent_id as string).trim() : undefined;
  }

  if (Object.keys(result).length === 0 && errors.length === 0) {
    errors.push('At least one updatable field must be provided');
  }

  if (errors.length > 0) return { success: false, errors };
  return { success: true, data: result };
}
