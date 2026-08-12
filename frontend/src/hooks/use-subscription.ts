export function useSubscription() {
  // TODO: Subscription status & feature limits check
  return { plan: 'FREE', isTrial: false, isExpired: false };
}
