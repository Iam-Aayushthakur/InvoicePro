import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api/api-client';

export interface Notification {
  id: string;
  type: 'SYSTEM' | 'BILLING' | 'ALERT';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export function useNotifications(page = 1, limit = 50) {
  return useQuery({
    queryKey: ['notifications', page, limit],
    queryFn: () => apiClient.get<{ notifications: Notification[]; total: number }>(`/notifications?page=${page}&limit=${limit}`),
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.patch(`/notifications/${id}/read`, {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.patch('/notifications/read-all', {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
}
