'use client';

import { useState } from 'react';
import { ArrowRight, LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import type { Locale } from '@/lib/i18n';

export function StartRenewalButton({ locale, label }: { locale: Locale; label: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  async function start() {
    setLoading(true); setError('');
    try {
      const response = await fetch('/api/applications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ locale }) });
      if (!response.ok) throw new Error('start failed');
      const data = await response.json() as { id: string };
      router.push(`/${locale}/renew/${data.id}`);
    } catch {
      setError(locale === 'hi' ? 'नया डेमो शुरू नहीं हो सका। फिर कोशिश करें।' : 'The new demo could not start. Please try again.');
      setLoading(false);
    }
  }
  return (
    <div>
      <Button type="button" onClick={start} disabled={loading} className="h-12 bg-[#0F766E] px-5 text-base hover:bg-[#0B5F59]">
        {loading ? <LoaderCircle className="animate-spin" /> : <ArrowRight />}{label}
      </Button>
      {error && <p role="alert" className="mt-2 text-sm text-[#B42318]">{error}</p>}
    </div>
  );
}
