import { AuditRepository } from '../repositories/audit.repository.js';
import { UserContext, assertPermission } from '../core/permissions.js';

interface Env { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string; }

export const AuditService = {
  async listAuditLogs(user: UserContext, page: number, limit: number, env: Env) {
    assertPermission(user, 'settings.read'); // Requires high-level access
    return AuditRepository.list(user.companyId, page, limit, env);
  }
};
