import { Env, supabaseInsert, supabaseList, supabasePatch } from './base.repository.js';
import type { Notification, CreateNotificationInput } from '../core/types/notification.types.js';

export const NotificationRepository = {
  async create(companyId: string, data: CreateNotificationInput, env: Env): Promise<Notification> {
    const payload = {
      company_id: companyId,
      user_id: data.user_id,
      type: data.type,
      title: data.title,
      message: data.message,
      data: data.data || {}
    };
    return supabaseInsert<Notification>(env, 'notifications', payload);
  },

  async list(companyId: string, userId: string, page: number, limit: number, env: Env) {
    // List company-wide or user-specific notifications
    const query = `company_id=eq.${companyId}&or=(user_id.eq.${userId},user_id.is.null)&select=*&order=created_at.desc`;
    return supabaseList<Notification>(env, 'notifications', query, page, limit);
  },

  async markAsRead(id: string, companyId: string, userId: string, env: Env): Promise<Notification> {
    // Can only mark read if it belongs to company and user (or company-wide)
    const query = `id=eq.${id}&company_id=eq.${companyId}`;
    return supabasePatch<Notification>(env, 'notifications', query, { read_at: new Date().toISOString() });
  },

  async markAllAsRead(companyId: string, userId: string, env: Env): Promise<void> {
    const query = `company_id=eq.${companyId}&or=(user_id.eq.${userId},user_id.is.null)&read_at=is.null`;
    // We cannot use simple supabasePatch for multiple without making a specific REST call.
    // Patching multiple is supported by PostgREST if we don't supply `Prefer: return=representation`.
    await fetch(`${env.SUPABASE_URL}/rest/v1/notifications?${query}`, {
      method: 'PATCH',
      headers: {
        'apikey': env.SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ read_at: new Date().toISOString() })
    });
  }
};
