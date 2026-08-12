import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api/api-client';

export interface InvoiceItem {
  id: string;
  product_id: string;
  product_name?: string;
  hsn_code?: string;
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

export interface Invoice {
  id: string;
  invoice_number: string;
  customer_id: string;
  customer?: { name: string; gstin?: string; email?: string };
  status: 'DRAFT' | 'ISSUED' | 'PAID' | 'PARTIALLY_PAID' | 'OVERDUE' | 'CANCELLED';
  invoice_date: string;
  due_date: string;
  subtotal: number;
  taxable_amount: number;
  cgst_total: number;
  sgst_total: number;
  igst_total: number;
  tax_total: number;
  round_off: number;
  grand_total: number;
  paid_amount: number;
  balance_amount: number;
  notes: string | null;
  items?: InvoiceItem[];
  created_at: string;
  updated_at: string;
}

export interface CreateInvoiceInput {
  customer_id: string;
  invoice_number: string;
  due_date: string;
  notes?: string;
  items: {
    product_id: string;
    quantity: number;
    unit_price: number;
    discount?: number;
    tax_rate?: number;
  }[];
}

export function useInvoices(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['invoices', page, limit],
    queryFn: () => apiClient.get<{ invoices: Invoice[]; total: number; page: number; totalPages: number }>(`/invoices?page=${page}&limit=${limit}`),
  });
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: ['invoices', id],
    queryFn: () => apiClient.get<{ invoice: Invoice }>(`/invoices/${id}`),
    enabled: !!id,
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInvoiceInput) => apiClient.post<{ invoice: Invoice }>('/invoices', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

export function useUpdateInvoiceStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiClient.patch<{ invoice: Invoice }>(`/invoices/${id}/status`, { status }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoices', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}
