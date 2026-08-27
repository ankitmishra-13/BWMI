import { notFound, redirect } from 'next/navigation';
import { requireChatGPTUser } from '@/app/chatgpt-auth';
import { RenewalWizard } from '@/components/renewal-wizard';
import { SiteHeader } from '@/components/site-header';
import { getApplicationBundle } from '@/lib/data';
import { getCopy, isLocale, localPath } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

export default async function RenewalPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale: rawLocale, id } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const user = await requireChatGPTUser(localPath(locale, `/renew/${id}`));
  const bundle = await getApplicationBundle(user.userId, id);
  if (!bundle) notFound();
  if (bundle.application.status !== 'Draft') redirect(localPath(locale, `/status/${id}`));
  const copy = getCopy(locale);
  return <div lang={locale}><SiteHeader locale={locale} user={user} /><main id="main" className="py-8 sm:py-12"><div className="shell"><p className="eyebrow">{copy.wizardEyebrow}</p><h1 className="mt-2 text-3xl font-semibold sm:text-5xl">{copy.wizardTitle}</h1><div className="mt-8"><RenewalWizard initial={bundle} locale={locale} copy={copy} /></div></div></main></div>;
}
