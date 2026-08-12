import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api/api-client';

export interface Supplier {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  gstin: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
}

export function useSuppliers(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['suppliers', page, limit],
    queryFn: () => apiClient.get<{ suppliers: Supplier[]; total: number }>(`/suppliers?page=${page}&limit=${limit}`)
  });
}

export function useSupplier(id: string) {
  return useQuery({
    queryKey: ['suppliers', id],
    queryFn: () => apiClient.get<{ supplier: Supplier }>(`/suppliers/${id}`),
    enabled: !!id,
  });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Supplier>) => apiClient.post<{ supplier: Supplier }>('/suppliers', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Supplier> }) => 
      apiClient.patch<{ supplier: Supplier }>(`/suppliers/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['suppliers', variables.id] });
    },
  });
}
