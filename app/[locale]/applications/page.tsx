import Link from 'next/link';
import { ArrowRight, CheckCircle2, Clock3, FileText, Plus, Route } from 'lucide-react';
import { notFound } from 'next/navigation';
import { requireChatGPTUser } from '@/app/chatgpt-auth';
import { AccountShell } from '@/components/account-shell';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { accountCopy } from '@/lib/account-copy';
import { ensureSyntheticCitizen, getCitizenWorkspace } from '@/lib/data';
import { isLocale, localPath } from '@/lib/i18n';
import { getService, t } from '@/lib/services';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

type StatusFilter = 'all' | 'draft' | 'submitted';

export default async function ApplicationsPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ status?: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const user = await requireChatGPTUser(localPath(locale, '/applications'));
  await ensureSyntheticCitizen(user, locale);
  const [{ applications, otherApplications }, query] = await Promise.all([getCitizenWorkspace(user.userId), searchParams]);
  const filter: StatusFilter = query.status === 'draft' || query.status === 'submitted' ? query.status : 'all';
  const copy = accountCopy[locale];
  const allItems = [
    ...applications.map((application) => ({ kind: 'renewal' as const, application, status: application.status })),
    ...otherApplications.map((application) => ({ kind: 'service' as const, application, status: application.status })),
  ].sort((a, b) => b.application.updatedAt.localeCompare(a.application.updatedAt));
  const visible = filter === 'all' ? allItems : allItems.filter((item) => filter === 'draft' ? item.status === 'Draft' : item.status !== 'Draft');
  const draftCount = allItems.filter((item) => item.status === 'Draft').length;
  const submittedCount = allItems.length - draftCount;

  return (
    <div className="civic-paper">
      <SiteHeader locale={locale} user={user} />
      <main id="main" className="py-9 sm:py-14">
        <AccountShell locale={locale} active="applications">
          <p className="eyebrow">{copy.applicationsEyebrow}</p>
          <div className="mt-3 flex flex-col gap-5 border-b pb-8 lg:flex-row lg:items-end lg:justify-between"><div><h1 className="max-w-4xl text-4xl leading-[1.02] tracking-[-.035em] sm:text-6xl">{copy.applicationsTitle}</h1><p className="mt-4 max-w-2xl text-muted-foreground">{copy.applicationsBody}</p></div><Button asChild size="lg"><Link href={localPath(locale, '/services')}><Plus data-icon="inline-start" />{copy.startService}</Link></Button></div>

          <div className="mt-7 flex gap-2 overflow-x-auto pb-2" aria-label={locale === 'hi' ? 'आवेदन फ़िल्टर' : 'Application filters'}>
            <FilterLink locale={locale} current={filter} value="all" label={`${copy.all} · ${allItems.length}`} />
            <FilterLink locale={locale} current={filter} value="draft" label={`${copy.drafts} · ${draftCount}`} />
            <FilterLink locale={locale} current={filter} value="submitted" label={`${copy.submitted} · ${submittedCount}`} />
          </div>

          {visible.length === 0 ? (
            <section className="mt-7 border-y py-14 text-center"><span className="mx-auto grid size-12 place-items-center rounded-full bg-secondary"><FileText className="size-5" /></span><h2 className="mt-5 text-2xl">{copy.noApplications}</h2><Button asChild variant="outline" className="mt-6"><Link href={localPath(locale, '/services')}>{copy.services}<ArrowRight data-icon="inline-end" /></Link></Button></section>
          ) : (
            <section aria-label={copy.applications} className="ios-panel mt-7 overflow-hidden px-5 sm:px-7">
              {visible.map((item) => {
                const submitted = item.status !== 'Draft';
                const service = item.kind === 'service' ? getService(item.application.serviceSlug) : null;
                if (item.kind === 'service' && !service) return null;
                const title = item.kind === 'renewal' ? (locale === 'hi' ? 'ड्राइविंग लाइसेंस नवीनीकरण' : 'Driving licence renewal') : t(service!.title, locale);
                const href = item.kind === 'renewal'
                  ? (submitted ? localPath(locale, `/status/${item.application.id}`) : localPath(locale, `/renew/${item.application.id}`))
                  : (submitted ? localPath(locale, `/services/${service!.slug}/receipt/${item.application.id}`) : localPath(locale, `/services/${service!.slug}/apply/${item.application.id}`));
                const stepTotal = item.kind === 'renewal' ? 6 : 4;
                return (
                  <article key={`${item.kind}-${item.application.id}`} className="grid gap-5 border-b py-6 last:border-0 md:grid-cols-[1fr_auto] md:items-center">
                    <div className="flex items-start gap-4"><span className={cn('grid size-11 shrink-0 place-items-center rounded-full', submitted ? 'bg-[#EAF7EF] text-success' : 'bg-secondary')} aria-hidden="true">{submitted ? <CheckCircle2 className="size-5" /> : <Clock3 className="size-5" />}</span><div><div className="flex flex-wrap items-center gap-2"><h2 className="text-xl">{title}</h2><Badge variant="outline" className={submitted ? 'bg-[#EAF7EF] text-success' : 'bg-white'}>{submitted ? copy.submitted : copy.drafts}</Badge></div><p className="mt-2 text-sm text-muted-foreground">{submitted ? (locale === 'hi' ? 'मॉक आवेदन जमा हुआ और रसीद तैयार है।' : 'Mock application submitted and receipt ready.') : (locale === 'hi' ? `चरण ${item.application.currentStep + 1}, कुल ${stepTotal}` : `Step ${item.application.currentStep + 1} of ${stepTotal}`)}</p><p className="mt-2 font-mono text-xs text-muted-foreground">{item.application.id.slice(0, 8).toUpperCase()}</p></div></div>
                    <Button asChild variant="outline" className="justify-self-start md:justify-self-end"><Link href={href}>{submitted ? copy.view : copy.resume}<ArrowRight data-icon="inline-end" /></Link></Button>
                  </article>
                );
              })}
            </section>
          )}

          <aside className="mt-8 grid gap-5 border-t pt-8 sm:grid-cols-2"><div className="flex items-start gap-4"><span className="grid size-11 place-items-center rounded-full bg-secondary"><Route className="size-5" /></span><div><h2 className="text-lg">{locale === 'hi' ? 'स्थिति के साथ अगला कदम' : 'Status with a next step'}</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">{locale === 'hi' ? 'हर आवेदन बताता है कि क्या पूरा है और आगे क्या करना है।' : 'Every application explains what is complete and what to do next.'}</p></div></div><div className="flex items-start gap-4"><span className="grid size-11 place-items-center rounded-full bg-secondary"><FileText className="size-5" /></span><div><h2 className="text-lg">{locale === 'hi' ? 'ड्राफ्ट सुरक्षित रहते हैं' : 'Drafts stay safe'}</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">{locale === 'hi' ? 'पृष्ठ छोड़ें और अपने आखिरी सहेजे चरण से जारी रखें।' : 'Leave the page and continue from your last saved step.'}</p></div></div></aside>
        </AccountShell>
      </main>
    </div>
  );
}

function FilterLink({ locale, current, value, label }: { locale: 'en' | 'hi'; current: StatusFilter; value: StatusFilter; label: string }) {
  return <Link href={value === 'all' ? localPath(locale, '/applications') : localPath(locale, `/applications?status=${value}`)} aria-current={current === value ? 'page' : undefined} className={cn('flex min-h-11 shrink-0 items-center rounded-full border px-4 text-sm font-medium', current === value ? 'bg-primary text-primary-foreground' : 'bg-white text-muted-foreground hover:text-foreground')}>{label}</Link>;
}
