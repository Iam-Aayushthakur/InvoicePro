export const BACKEND_PLANS = {
  FREE: { maxInvoicesPerMonth: 20, maxUsers: 2 },
  STARTER: { maxInvoicesPerMonth: 200, maxUsers: 5 },
  PRO: { maxInvoicesPerMonth: 1000, maxUsers: 15 },
  BUSINESS: { maxInvoicesPerMonth: 10000, maxUsers: 50 },
  ENTERPRISE: { maxInvoicesPerMonth: -1, maxUsers: -1 },
} as const;
