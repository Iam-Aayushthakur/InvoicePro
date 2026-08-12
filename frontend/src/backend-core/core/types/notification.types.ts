export interface Notification {
  id: string;
  company_id: string;
  user_id: string | null;
  type: 'SYSTEM' | 'BILLING' | 'LOW_STOCK' | 'OVERDUE_INVOICE';
  title: string;
  message: string;
  data: Record<string, any>;
  read_at: string | null;
  created_at: string;
}

export interface CreateNotificationInput {
  user_id?: string;
  type: Notification['type'];
  title: string;
  message: string;
  data?: Record<string, any>;
}
