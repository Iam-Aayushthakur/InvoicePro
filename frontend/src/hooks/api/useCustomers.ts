import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api/api-client';

export interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  gstin: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
}

export function useCustomers(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['customers', page, limit],
    queryFn: () => apiClient.get<{ customers: Customer[]; total: number }>(`/customers?page=${page}&limit=${limit}`)
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: ['customers', id],
    queryFn: () => apiClient.get<{ customer: Customer }>(`/customers/${id}`),
    enabled: !!id,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Customer>) => apiClient.post<{ customer: Customer }>('/customers', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Customer> }) => 
      apiClient.patch<{ customer: Customer }>(`/customers/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customers', variables.id] });
    },
  });
}
