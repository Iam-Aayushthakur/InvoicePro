import { SubscriptionRepository } from '../repositories/subscription.repository.js';
import { UserContext, assertPermission } from '../core/permissions.js';

interface Env { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string; }

export const SubscriptionService = {
  async getSubscriptionDetails(user: UserContext, env: Env) {
    assertPermission(user, 'settings.read');
    
    const sub = await SubscriptionRepository.getActiveSubscription(user.companyId, env);
    const usage = await SubscriptionRepository.getUsage(user.companyId, env);
    
    return { subscription: sub, usage };
  }
};
