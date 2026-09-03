'use client';

import { useSyncExternalStore } from 'react';
import { SiteFooter } from '@/components/site-footer';
import type { Locale } from '@/lib/i18n';

const subscribe = () => () => undefined;

export function DeferredSiteFooter({ locale }: { locale: Locale }) {
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  if (!hydrated) return null;
  return <SiteFooter locale={locale} />;
}
