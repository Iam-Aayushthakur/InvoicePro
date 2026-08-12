import { NotificationRepository } from '../repositories/notification.repository.js';
import { UserContext, assertPermission } from '../core/permissions.js';
import type { CreateNotificationInput, Notification } from '../core/types/notification.types.js';

interface Env { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string; }

export const NotificationService = {
  async listNotifications(user: UserContext, page: number, limit: number, env: Env) {
    // Basic authenticated users can read their own notifications
    return NotificationRepository.list(user.companyId, user.userId, page, limit, env);
  },
  
  async createNotification(data: CreateNotificationInput, user: UserContext, env: Env): Promise<Notification> {
    assertPermission(user, 'settings.update'); // Only admin can create manual notifications
    return NotificationRepository.create(user.companyId, data, env);
  },

  async markAsRead(id: string, user: UserContext, env: Env): Promise<Notification> {
    return NotificationRepository.markAsRead(id, user.companyId, user.userId, env);
  },

  async markAllAsRead(user: UserContext, env: Env): Promise<void> {
    return NotificationRepository.markAllAsRead(user.companyId, user.userId, env);
  }
};
