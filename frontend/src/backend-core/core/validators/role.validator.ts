// Role & Permission validation schemas
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: string[];
}

export function validateAssignPermissions(body: unknown): ValidationResult<{ permission_ids: string[] }> {
  const data = body as Record<string, unknown>;
  if (!data || typeof data !== 'object') return { success: false, errors: ['Request body must be a JSON object'] };
  
  if (!Array.isArray(data.permission_ids)) {
    return { success: false, errors: ['permission_ids must be an array of strings'] };
  }
  
  if (!data.permission_ids.every(id => typeof id === 'string')) {
    return { success: false, errors: ['All permission_ids must be strings'] };
  }

  return { success: true, data: { permission_ids: data.permission_ids } };
}
