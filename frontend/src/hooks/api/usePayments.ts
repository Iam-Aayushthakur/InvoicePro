import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api/api-client';

export interface Payment {
  id: string;
  invoice_id: string | null;
  purchase_id: string | null;
  amount: number;
  payment_method: 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CHEQUE' | 'CARD' | 'OTHER';
  payment_date: string;
  reference_number: string | null;
  notes: string | null;
  created_at: string;
}

export interface CreatePaymentInput {
  invoice_id?: string;
  purchase_id?: string;
  amount: number;
  payment_method: string;
  payment_date?: string;
  reference_number?: string;
  notes?: string;
}

export function usePayments(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['payments', page, limit],
    queryFn: () => apiClient.get<{ payments: Payment[]; total: number }>(`/payments?page=${page}&limit=${limit}`),
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePaymentInput) => apiClient.post<{ payment: Payment }>('/payments', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
