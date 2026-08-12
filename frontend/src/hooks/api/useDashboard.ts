import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api/api-client';

export interface DashboardStats {
  total_sales: number;
  total_revenue: number;
  receivables: number;
  payables: number;
  recent_invoices: any[];
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => apiClient.get<{ stats: DashboardStats }>('/dashboard'),
  });
}
