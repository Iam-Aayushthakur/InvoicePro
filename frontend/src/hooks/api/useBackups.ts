import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api/api-client';

export interface Backup {
  id: string;
  backup_type: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  file_size: number | null;
  created_at: string;
}

export function useBackups(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['backups', page, limit],
    queryFn: () => apiClient.get<{ backups: Backup[]; total: number }>(`/backups?page=${page}&limit=${limit}`),
  });
}

export function useTriggerBackup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { backup_type?: string }) => apiClient.post<{ backup: Backup }>('/backups', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['backups'] }),
  });
}
