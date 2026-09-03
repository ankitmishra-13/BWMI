import { notFound } from 'next/navigation';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { ReadinessExperience } from '@/components/readiness-experience';
import { SiteHeader } from '@/components/site-header';
import { isLocale } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

export default async function ReadinessPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const user = await getChatGPTUser();
  return <div className="civic-paper"><SiteHeader locale={rawLocale} user={user} /><main id="main"><ReadinessExperience locale={rawLocale} signedIn={Boolean(user)} /></main></div>;
}
