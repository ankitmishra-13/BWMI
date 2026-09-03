import { SlidersHorizontal } from 'lucide-react';
import { notFound } from 'next/navigation';
import { requireChatGPTUser } from '@/app/chatgpt-auth';
import { AccountShell } from '@/components/account-shell';
import { PreferencesPanel } from '@/components/preferences-panel';
import { SiteHeader } from '@/components/site-header';
import { ensureSyntheticCitizen, getCitizenPreferences } from '@/lib/data';
import { isLocale, localPath } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

export default async function PreferencesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const user = await requireChatGPTUser(localPath(locale, '/preferences'));
  await ensureSyntheticCitizen(user, locale);
  const preferences = await getCitizenPreferences(user.userId);
  return <div className="civic-paper"><SiteHeader locale={locale} user={user} /><main id="main" className="py-9 sm:py-14"><AccountShell locale={locale} active="preferences"><div className="content-enter"><p className="eyebrow">{locale === 'hi' ? 'आपके हिसाब से अनुभव' : 'Your experience'}</p><div className="mt-3 border-b pb-8"><SlidersHorizontal className="mb-4 size-6 text-muted-foreground" /><h1 className="text-[clamp(2.7rem,9vw,4rem)] leading-[1.02] tracking-[-.035em]">{locale === 'hi' ? 'देखें, पढ़ें और आगे बढ़ें—अपने तरीके से।' : 'See, read, and continue your way.'}</h1><p className="mt-4 max-w-2xl text-muted-foreground">{locale === 'hi' ? 'ये विकल्प Raahi को समझना आसान बनाते हैं। तकनीकी सेटिंग जानने की ज़रूरत नहीं है।' : 'These choices make Raahi easier to understand. You do not need to know any technical settings.'}</p></div><div className="mt-8 max-w-3xl"><PreferencesPanel locale={locale} initialPreferences={preferences} /></div></div></AccountShell></main></div>;
}
