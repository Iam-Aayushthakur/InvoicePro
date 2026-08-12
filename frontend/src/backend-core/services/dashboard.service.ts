import { DashboardRepository } from '../repositories/dashboard.repository.js';
import { UserContext, assertPermission } from '../core/permissions.js';
import type { DashboardStats } from '../core/types/dashboard.types.js';

interface Env { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string; }

export const DashboardService = {
  async getDashboardStats(user: UserContext, env: Env): Promise<DashboardStats> {
    assertPermission(user, 'reporting.read'); // Assume dashboard uses reporting permissions
    return DashboardRepository.getStats(user.companyId, env);
  }
};
