import { notFound } from 'next/navigation';
import { ExperiencePreferencesBootstrap } from '@/components/experience-preferences-provider';
import { SiteFooter } from '@/components/site-footer';
import { isLocale } from '@/lib/i18n';

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  return <div id="top" lang={rawLocale} className="experience-root flex min-h-screen flex-col" data-large-text="false" data-high-contrast="false" data-reduced-motion="false" data-low-bandwidth="false" data-simplified-guidance="false" data-read-aloud="false"><ExperiencePreferencesBootstrap /><div className="flex-1">{children}</div><SiteFooter locale={rawLocale} /></div>;
}
