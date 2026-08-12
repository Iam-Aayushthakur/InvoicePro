import type { CreateNotificationInput } from '../types/notification.types.js';

export interface ValidationResult<T> { success: boolean; data?: T; errors?: string[]; }

const VALID_TYPES = ['SYSTEM', 'BILLING', 'LOW_STOCK', 'OVERDUE_INVOICE'];

export function validateCreateNotification(body: unknown): ValidationResult<CreateNotificationInput> {
  const errors: string[] = [];
  const data = body as Record<string, unknown>;

  if (!data || typeof data !== 'object') return { success: false, errors: ['Request body must be a JSON object'] };
  
  if (!data.title || typeof data.title !== 'string') errors.push('title is required');
  if (!data.message || typeof data.message !== 'string') errors.push('message is required');
  
  if (!data.type || !VALID_TYPES.includes(data.type as string)) {
    errors.push(`type must be one of: ${VALID_TYPES.join(', ')}`);
  }

  if (errors.length > 0) return { success: false, errors };

  return {
    success: true,
    data: {
      user_id: data.user_id ? data.user_id as string : undefined,
      type: data.type as CreateNotificationInput['type'],
      title: data.title as string,
      message: data.message as string,
      data: data.data ? data.data as Record<string, any> : {},
    }
  };
}
