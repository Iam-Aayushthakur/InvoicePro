export interface Subscription {
  id: string;
  company_id: string;
  plan_id: string;
  status: 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'PAUSED' | 'CANCELLED' | 'EXPIRED';
  billing_interval: 'MONTHLY' | 'YEARLY';
  current_period_start: string;
  current_period_end: string;
}

export interface UsageRecord {
  id: string;
  company_id: string;
  metric_name: string;
  usage_count: number;
  period_start: string;
  period_end: string;
}
