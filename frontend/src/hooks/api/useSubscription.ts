import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api/api-client';

export interface Subscription {
  id: string;
  plan_name: string;
  status: 'ACTIVE' | 'TRIAL' | 'EXPIRED' | 'CANCELLED';
  current_period_start: string;
  current_period_end: string;
  max_invoices: number;
  max_users: number;
  max_storage_mb: number;
}

export interface UsageRecord {
  metric: string;
  current_value: number;
  limit_value: number;
}

export function useSubscriptionDetails() {
  return useQuery({
    queryKey: ['subscription'],
    queryFn: () => apiClient.get<{ subscription: Subscription | null; usage: UsageRecord[] }>('/subscriptions'),
  });
}
