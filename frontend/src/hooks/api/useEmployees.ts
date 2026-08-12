import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api/api-client';

export interface Member {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  role: 'OWNER' | 'ADMIN' | 'CASHIER' | 'EMPLOYEE';
  status: 'ACTIVE' | 'INACTIVE';
  joined_at: string;
}

export function useMembers(page = 1, limit = 50) {
  return useQuery({
    queryKey: ['members', page, limit],
    queryFn: () => apiClient.get<{ members: Member[]; total: number }>(`/users?page=${page}&limit=${limit}`),
  });
}

export function useInviteMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { email: string; full_name: string; role: string }) =>
      apiClient.post<{ member: Member }>('/users/invite', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['members'] }),
  });
}

export function useUpdateMemberRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      apiClient.patch(`/users/${userId}/role`, { role }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['members'] }),
  });
}

export function useRemoveMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => apiClient.delete(`/users/${userId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['members'] }),
  });
}
