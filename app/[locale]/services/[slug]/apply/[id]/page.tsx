import { notFound, redirect } from 'next/navigation';
import { requireChatGPTUser } from '@/app/chatgpt-auth';
import { ServiceApplicationWizard } from '@/components/service-application-wizard';
import { SiteHeader } from '@/components/site-header';
import { getServiceApplication } from '@/lib/data';
import { isLocale, localPath } from '@/lib/i18n';
import { getService, portalCopy, t } from '@/lib/services';

export const dynamic = 'force-dynamic';

export default async function ApplyPage({ params }: { params: Promise<{ locale: string; slug: string; id: string }> }) {
  const { locale: rawLocale, slug, id } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const service = getService(slug);
  if (!service || service.mode !== 'transaction' || service.renewalFlow) notFound();
  const user = await requireChatGPTUser(localPath(locale, `/services/${slug}/apply/${id}`));
  const application = await getServiceApplication(user.userId, id);
  if (!application || application.serviceSlug !== slug) notFound();
  if (application.status !== 'Draft') redirect(localPath(locale, `/services/${slug}/receipt/${id}`));
  const portal = portalCopy[locale];

  return <div lang={locale} className="civic-paper"><SiteHeader locale={locale} user={user} /><main id="main" className="py-10 sm:py-14"><div className="shell"><p className="eyebrow">{portal.servicePrototype}</p><h1 className="mt-3 max-w-4xl text-4xl leading-[1.02] tracking-[-.035em] sm:text-6xl">{t(service.title, locale)}</h1><p className="mt-4 max-w-2xl text-muted-foreground">{t(service.summary, locale)}</p><div className="mt-9"><ServiceApplicationWizard initial={application} service={service} locale={locale} /></div></div></main></div>;
}
