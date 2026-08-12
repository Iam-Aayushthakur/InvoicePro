export const SUBSCRIPTION_PLANS = {
  FREE: { name: 'Free', invoiceLimit: 20 },
  STARTER: { name: 'Starter', invoiceLimit: 200 },
  PRO: { name: 'Pro', invoiceLimit: 1000 },
  BUSINESS: { name: 'Business', invoiceLimit: 10000 },
  ENTERPRISE: { name: 'Enterprise', invoiceLimit: -1 },
} as const;
