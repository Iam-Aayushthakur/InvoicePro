// User input validation schemas

import type { UpdateUserProfileInput, InviteMemberInput, UpdateMemberRoleInput } from '../types/user.types.js';

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: string[];
}

export function validateUpdateProfile(body: unknown): ValidationResult<UpdateUserProfileInput> {
  const errors: string[] = [];
  const data = body as Record<string, unknown>;

  if (!data || typeof data !== 'object') {
    return { success: false, errors: ['Request body must be a JSON object'] };
  }

  const allowedFields = ['full_name', 'phone', 'avatar_url'];
  const provided = Object.keys(data).filter((k) => allowedFields.includes(k));
  if (provided.length === 0) {
    return { success: false, errors: ['At least one updatable field must be provided (full_name, phone, avatar_url)'] };
  }

  if (data.full_name !== undefined) {
    if (typeof data.full_name !== 'string' || data.full_name.trim().length < 2) {
      errors.push('full_name must be at least 2 characters');
    }
  }

  if (data.phone !== undefined && data.phone !== null) {
    if (typeof data.phone !== 'string' || data.phone.trim().length < 10) {
      errors.push('phone must be at least 10 digits');
    }
  }

  if (data.avatar_url !== undefined && data.avatar_url !== null) {
    if (typeof data.avatar_url !== 'string') {
      errors.push('avatar_url must be a string URL');
    }
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  const result: UpdateUserProfileInput = {};
  if (data.full_name !== undefined) result.full_name = (data.full_name as string).trim();
  if (data.phone !== undefined) result.phone = data.phone ? (data.phone as string).trim() : undefined;
  if (data.avatar_url !== undefined) result.avatar_url = data.avatar_url ? (data.avatar_url as string).trim() : undefined;

  return { success: true, data: result };
}

export function validateInviteMember(body: unknown): ValidationResult<InviteMemberInput> {
  const errors: string[] = [];
  const data = body as Record<string, unknown>;

  if (!data || typeof data !== 'object') {
    return { success: false, errors: ['Request body must be a JSON object'] };
  }

  if (!data.email || typeof data.email !== 'string' || !data.email.includes('@')) {
    errors.push('email is required and must be a valid email address');
  }

  if (!data.full_name || typeof data.full_name !== 'string' || (data.full_name as string).trim().length < 2) {
    errors.push('full_name is required and must be at least 2 characters');
  }

  if (!data.role_id || typeof data.role_id !== 'string') {
    errors.push('role_id is required (UUID of role to assign)');
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      email: (data.email as string).trim().toLowerCase(),
      full_name: (data.full_name as string).trim(),
      role_id: (data.role_id as string).trim(),
    },
  };
}

export function validateUpdateMemberRole(body: unknown): ValidationResult<UpdateMemberRoleInput> {
  const data = body as Record<string, unknown>;

  if (!data || typeof data !== 'object') {
    return { success: false, errors: ['Request body must be a JSON object'] };
  }

  if (!data.role_id || typeof data.role_id !== 'string') {
    return { success: false, errors: ['role_id is required (UUID of new role to assign)'] };
  }

  return { success: true, data: { role_id: (data.role_id as string).trim() } };
}
