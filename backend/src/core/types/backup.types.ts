export interface Backup {
  id: string;
  company_id: string;
  backup_type: 'AUTOMATED' | 'MANUAL';
  storage_path: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  size_bytes: number;
  created_at: string;
  completed_at: string | null;
  created_by: string | null;
}

export interface CreateBackupInput {
  backup_type?: 'AUTOMATED' | 'MANUAL';
}
