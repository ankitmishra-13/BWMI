'use client';

import { useState } from 'react';
import { ArrowRight, LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import type { Locale } from '@/lib/i18n';

export function ServiceStartButton({ locale, serviceSlug, label, renewalFlow = false }: { locale: Locale; serviceSlug: string; label: string; renewalFlow?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function start() {
    setLoading(true);
    setError('');
    try {
      const endpoint = renewalFlow ? '/api/applications' : '/api/service-applications';
      const body = renewalFlow ? { locale } : { locale, serviceSlug };
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!response.ok) throw new Error('start failed');
      const data = await response.json() as { id: string };
      router.push(renewalFlow ? `/${locale}/renew/${data.id}` : `/${locale}/services/${serviceSlug}/apply/${data.id}`);
    } catch {
      setError(locale === 'hi' ? 'डेमो शुरू नहीं हो सका। कृपया फिर कोशिश करें।' : 'The demo could not start. Please try again.');
      setLoading(false);
    }
  }

  return <div><Button type="button" onClick={start} disabled={loading} size="lg">{loading ? <LoaderCircle className="animate-spin" data-icon="inline-start" /> : <ArrowRight data-icon="inline-start" />}{label}</Button>{error && <p role="alert" className="mt-2 text-sm text-destructive">{error}</p>}</div>;
}
