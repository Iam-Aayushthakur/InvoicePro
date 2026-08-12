import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api/api-client';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  sku: string | null;
  barcode: string | null;
  category_id: string | null;
  unit: string;
  purchase_price: number;
  selling_price: number;
  tax_rate: number;
  hsn_sac: string | null;
  track_inventory: boolean;
  minimum_stock: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export function useProducts(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['products', page, limit],
    queryFn: () => apiClient.get<{ products: Product[]; total: number }>(`/products?page=${page}&limit=${limit}`)
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Product>) => apiClient.post<{ product: Product }>('/products', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) => 
      apiClient.patch<{ product: Product }>(`/products/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', variables.id] });
    },
  });
}
