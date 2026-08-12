import { BackupRepository } from '../repositories/backup.repository.js';
import { UserContext, assertPermission } from '../core/permissions.js';
import type { Backup, CreateBackupInput } from '../core/types/backup.types.js';

interface Env { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string; }

export const BackupService = {
  async listBackups(user: UserContext, page: number, limit: number, env: Env) {
    assertPermission(user, 'settings.read');
    return BackupRepository.list(user.companyId, page, limit, env);
  },

  async triggerBackup(data: CreateBackupInput, user: UserContext, env: Env): Promise<Backup> {
    assertPermission(user, 'settings.update');
    // In a real system, this would push a message to a queue to perform pg_dump.
    return BackupRepository.create(user.companyId, data, user.userId, env);
  }
};
