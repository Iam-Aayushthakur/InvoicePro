import { Env, supabaseGetOne, supabaseList } from './base.repository.js';
import type { Subscription, UsageRecord } from '../core/types/subscription.types.js';

export const SubscriptionRepository = {
  async getActiveSubscription(companyId: string, env: Env): Promise<Subscription | null> {
    return supabaseGetOne<Subscription>(env, 'subscriptions', `company_id=eq.${companyId}&order=created_at.desc`);
  },

  async getUsage(companyId: string, env: Env): Promise<UsageRecord[]> {
    const d = new Date();
    const firstDay = new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0];
    return supabaseList<UsageRecord>(env, 'usage_records', `company_id=eq.${companyId}&period_start=gte.${firstDay}`, 1, 10).then(r => r.data);
  }
};
