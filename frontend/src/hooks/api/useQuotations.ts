import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api/api-client';

export interface QuotationItem {
  id: string;
  product_id: string;
  product_name?: string;
  quantity: number;
  unit_price: number;
  discount: number;
  tax_rate: number;
  taxable_amount: number;
  cgst_amount: number;
  sgst_amount: number;
  igst_amount: number;
  line_total: number;
}

export interface Quotation {
  id: string;
  quotation_number: string;
  customer_id: string;
  customer?: { name: string; email?: string };
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  valid_until: string | null;
  subtotal: number;
  taxable_amount: number;
  cgst_total: number;
  sgst_total: number;
  igst_total: number;
  tax_total: number;
  grand_total: number;
  notes: string | null;
  items?: QuotationItem[];
  created_at: string;
}

export interface CreateQuotationInput {
  customer_id: string;
  quotation_number: string;
  valid_until?: string;
  notes?: string;
  items: {
    product_id: string;
    quantity: number;
    unit_price: number;
    discount?: number;
    tax_rate?: number;
  }[];
}

export function useQuotations(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['quotations', page, limit],
    queryFn: () => apiClient.get<{ quotations: Quotation[]; total: number }>(`/quotations?page=${page}&limit=${limit}`),
  });
}

export function useQuotation(id: string) {
  return useQuery({
    queryKey: ['quotations', id],
    queryFn: () => apiClient.get<{ quotation: Quotation }>(`/quotations/${id}`),
    enabled: !!id,
  });
}

export function useCreateQuotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateQuotationInput) => apiClient.post<{ quotation: Quotation }>('/quotations', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
    },
  });
}

export function useUpdateQuotationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiClient.patch<{ quotation: Quotation }>(`/quotations/${id}/status`, { status }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      queryClient.invalidateQueries({ queryKey: ['quotations', variables.id] });
    },
  });
}
