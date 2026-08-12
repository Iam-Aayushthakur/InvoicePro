import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api/api-client';

export interface AuditLog {
  id: string;
  user_id: string;
  user_email?: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  details: Record<string, any> | null;
  ip_address: string | null;
  created_at: string;
}

export function useAuditLogs(page = 1, limit = 50) {
  return useQuery({
    queryKey: ['audit-logs', page, limit],
    queryFn: () => apiClient.get<{ auditLogs: AuditLog[]; total: number; page: number; totalPages: number }>(`/audit-logs?page=${page}&limit=${limit}`),
  });
}
