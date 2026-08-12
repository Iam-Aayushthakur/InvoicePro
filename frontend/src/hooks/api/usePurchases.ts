import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api/api-client';

export interface PurchaseItem {
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

export interface Purchase {
  id: string;
  purchase_number: string;
  supplier_id: string;
  supplier?: { name: string; gstin?: string };
  status: 'DRAFT' | 'ORDERED' | 'RECEIVED' | 'CANCELLED';
  purchase_date: string;
  subtotal: number;
  taxable_amount: number;
  cgst_total: number;
  sgst_total: number;
  igst_total: number;
  tax_total: number;
  grand_total: number;
  paid_amount: number;
  balance_amount: number;
  notes: string | null;
  items?: PurchaseItem[];
  created_at: string;
}

export interface CreatePurchaseInput {
  supplier_id: string;
  purchase_number: string;
  notes?: string;
  items: {
    product_id: string;
    quantity: number;
    unit_price: number;
    discount?: number;
    tax_rate?: number;
  }[];
}

export function usePurchases(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['purchases', page, limit],
    queryFn: () => apiClient.get<{ purchases: Purchase[]; total: number }>(`/purchases?page=${page}&limit=${limit}`),
  });
}

export function usePurchase(id: string) {
  return useQuery({
    queryKey: ['purchases', id],
    queryFn: () => apiClient.get<{ purchase: Purchase }>(`/purchases/${id}`),
    enabled: !!id,
  });
}

export function useCreatePurchase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePurchaseInput) => apiClient.post<{ purchase: Purchase }>('/purchases', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

export function useUpdatePurchaseStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiClient.patch<{ purchase: Purchase }>(`/purchases/${id}/status`, { status }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      queryClient.invalidateQueries({ queryKey: ['purchases', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}
