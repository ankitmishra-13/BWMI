import type { Locale } from '@/lib/i18n';

export function paymentMethodLabel(method: string, locale: Locale) {
  const labels = {
    'mock-upi': { en: 'Mock UPI', hi: 'मॉक UPI' },
    'mock-card': { en: 'Mock card', hi: 'मॉक कार्ड' },
    'mock-netbanking': { en: 'Mock net banking', hi: 'मॉक नेट बैंकिंग' },
  } as const;
  return labels[method as keyof typeof labels]?.[locale] ?? labels['mock-upi'][locale];
}
