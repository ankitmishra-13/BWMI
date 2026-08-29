import { notFound } from 'next/navigation';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { SiteFooter } from '@/components/site-footer';
import { isLocale } from '@/lib/i18n';

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const user = await getChatGPTUser();
  return <div id="top" lang={rawLocale} className="flex min-h-screen flex-col"><div className="flex-1">{children}</div><SiteFooter locale={rawLocale} user={user} /></div>;
}
