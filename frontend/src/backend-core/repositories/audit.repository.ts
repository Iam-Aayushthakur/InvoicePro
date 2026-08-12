import { Env, supabaseList } from './base.repository.js';
import type { AuditLog } from '../core/types/audit.types.js';

export const AuditRepository = {
  async list(companyId: string, page: number, limit: number, env: Env) {
    return supabaseList<AuditLog & { users: { full_name: string } }>(
      env, 'audit_logs', `company_id=eq.${companyId}&select=*,users(full_name)&order=created_at.desc`, page, limit
    );
  }
};
