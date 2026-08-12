import { Env, supabaseInsert, supabaseList } from './base.repository.js';
import type { Backup, CreateBackupInput } from '../core/types/backup.types.js';

export const BackupRepository = {
  async create(companyId: string, data: CreateBackupInput, userId: string, env: Env): Promise<Backup> {
    const payload = {
      company_id: companyId,
      backup_type: data.backup_type || 'MANUAL',
      storage_path: `backups/${companyId}/${new Date().toISOString()}.sql`,
      status: 'PENDING',
      created_by: userId
    };
    return supabaseInsert<Backup>(env, 'backups', payload);
  },

  async list(companyId: string, page: number, limit: number, env: Env) {
    return supabaseList<Backup>(env, 'backups', `company_id=eq.${companyId}&select=*&order=created_at.desc`, page, limit);
  }
};
