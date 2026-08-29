'use client';

import { Languages } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import type { Copy, Locale } from '@/lib/i18n';

export function LanguageSwitcher({ locale, copy }: { locale: Locale; copy: Copy }) {
  const pathname = usePathname();
  const target = locale === 'en' ? 'hi' : 'en';
  const segments = pathname.split('/');
  segments[1] = target;
  const href = segments.join('/') || `/${target}`;
  return (
    <Button asChild variant="ghost" size="sm">
      <a href={href}><Languages aria-hidden="true" data-icon="inline-start" />{target === 'hi' ? copy.hindi : copy.english}</a>
    </Button>
  );
}
