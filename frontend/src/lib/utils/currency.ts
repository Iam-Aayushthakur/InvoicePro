import { useCompanyStore } from '../../stores/company.store';

export function formatCurrency(amount: number, currency?: string, locale: string = 'en-IN'): string {
  const storeCurrency = useCompanyStore.getState().preferences.currency || 'INR';
  const targetCurrency = currency || storeCurrency;
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: targetCurrency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
