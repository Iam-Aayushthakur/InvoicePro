import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api/api-client';

export interface Company {
  id: string;
  name: string;
  legal_name: string | null;
  gstin: string | null;
  pan: string | null;
  currency: string;
  timezone: string;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  country: string | null;
  is_onboarded: boolean;
}

export function useCompany(id: string | null) {
  return useQuery({
    queryKey: ['company', id],
    queryFn: () => apiClient.get<{ company: Company }>(`/companies/${id}`),
    enabled: !!id,
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Company> }) => 
      apiClient.patch<{ company: Company }>(`/companies/${id}`, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['company', variables.id] });
    },
  });
}
