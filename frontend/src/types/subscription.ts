export type PlanTier = 'FREE' | 'STARTER' | 'PRO' | 'BUSINESS' | 'ENTERPRISE';
export type SubscriptionState = 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'PAUSED' | 'CANCELLED' | 'EXPIRED';

export interface Subscription {
  id: string;
  companyId: string;
  plan: PlanTier;
  state: SubscriptionState;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}
