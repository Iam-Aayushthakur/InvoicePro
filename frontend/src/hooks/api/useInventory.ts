import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api/api-client';
import { Product } from './useProducts';

export interface Inventory {
  id: string;
  product_id: string;
  quantity: number;
  reserved_quantity: number;
  available_quantity: number;
  product?: Product;
}

export interface InventoryTransaction {
  id: string;
  product_id: string;
  transaction_type: 'OPENING' | 'PURCHASE' | 'SALE' | 'SALE_RETURN' | 'PURCHASE_RETURN' | 'ADJUSTMENT' | 'DAMAGE' | 'TRANSFER';
  quantity: number;
  notes: string | null;
  created_at: string;
}

export function useInventory(page = 1, limit = 50) {
  return useQuery({
    queryKey: ['inventory', page, limit],
    queryFn: () => apiClient.get<{ inventory: Inventory[]; total: number }>(`/inventory?page=${page}&limit=${limit}`)
  });
}

export function useInventoryTransactions(productId: string) {
  return useQuery({
    queryKey: ['inventory', 'transactions', productId],
    queryFn: () => apiClient.get<{ transactions: InventoryTransaction[] }>(`/inventory/${productId}/transactions`),
    enabled: !!productId,
  });
}

export function useRecordTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { product_id: string; transaction_type: string; quantity: number; notes?: string }) => 
      apiClient.post('/inventory/transaction', data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventory', 'transactions', variables.product_id] });
    },
  });
}
