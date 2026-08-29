import Link from 'next/link';
import { ArrowLeft, Check, CheckCircle2, Circle, Clock3, FileCheck2, ShieldCheck } from 'lucide-react';
import { notFound, redirect } from 'next/navigation';
import { requireChatGPTUser } from '@/app/chatgpt-auth';
import { PrintButton } from '@/components/print-button';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getApplicationBundle } from '@/lib/data';
import { getCopy, isLocale, localPath } from '@/lib/i18n';
import { paymentMethodLabel } from '@/lib/payment';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function StatusPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale: rawLocale, id } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const copy = getCopy(locale);
  const user = await requireChatGPTUser(localPath(locale, `/status/${id}`));
  const bundle = await getApplicationBundle(user.userId, id);
  if (!bundle) notFound();
  if (bundle.application.status === 'Draft') redirect(localPath(locale, `/renew/${id}`));
  const { application, payment } = bundle;
  if (!payment || !application.submittedAt) notFound();
  const dateLocale = locale === 'hi' ? 'hi-IN' : 'en-IN';
  const timeline = [
    [copy.submitted, copy.statusSubmittedBody, 'complete'],
    [copy.documentsChecking, copy.statusDocumentsBody, 'current'],
    [copy.underReview, copy.statusReviewBody, 'upcoming'],
    [copy.approved, copy.statusApprovedBody, 'upcoming'],
  ] as const;

  return (
    <div lang={locale} className="civic-paper">
      <SiteHeader locale={locale} user={user} />
      <main id="main" className="py-10 sm:py-14">
        <div className="shell max-w-5xl">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="eyebrow">{copy.receiptEyebrow}</p><h1 className="mt-3 max-w-4xl text-4xl leading-[1.02] tracking-[-.035em] sm:text-6xl">{copy.receiptTitle}</h1><p className="mt-4 max-w-2xl text-lg text-muted-foreground">{copy.receiptBody}</p></div>
            <PrintButton label={copy.downloadReceipt} />
          </div>

          <section aria-labelledby="receipt-heading" className="ios-panel mt-10 overflow-hidden">
            <div className="flex flex-col gap-5 border-b bg-[#F0F9F5] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div className="flex items-center gap-4"><span className="grid size-12 place-items-center rounded-full bg-white text-success"><CheckCircle2 /></span><div><h2 id="receipt-heading" className="text-2xl">{copy.submitted}</h2><p className="text-sm text-muted-foreground">{copy.prototype}</p></div></div>
              <Badge variant="outline" className="w-fit bg-white text-success"><ShieldCheck />SYNTHETIC</Badge>
            </div>
            <dl className="grid p-6 sm:grid-cols-2 sm:p-8">
              <ReceiptDatum label={copy.applicationNumber} value={`BWMI-${application.id.slice(0, 8).toUpperCase()}`} />
              <ReceiptDatum label={copy.transactionNumber} value={payment.transactionReference} />
              <ReceiptDatum label={copy.submittedOn} value={new Intl.DateTimeFormat(dateLocale, { dateStyle: 'long', timeStyle: 'short' }).format(new Date(application.submittedAt))} />
              <ReceiptDatum label={copy.amount} value="₹450.00 (mock)" />
              <ReceiptDatum label={copy.paymentMethod} value={paymentMethodLabel(payment.method, locale)} />
            </dl>
          </section>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_280px]">
            <section aria-labelledby="track-heading">
              <h2 id="track-heading" className="text-2xl sm:text-3xl">{copy.trackTitle}</h2>
              <ol className="mt-6">
                {timeline.map(([title, body, state], index) => (
                  <li key={title} className="relative grid grid-cols-[40px_1fr] gap-3 pb-8 last:pb-0">
                    {index < timeline.length - 1 && <span aria-hidden="true" className="absolute left-[15px] top-8 h-[calc(100%-8px)] w-0.5 bg-border" />}
                    <span className={cn('relative z-10 grid size-8 place-items-center rounded-full border-2', state === 'complete' ? 'border-success bg-success text-white' : state === 'current' ? 'border-primary bg-white text-primary' : 'border-border bg-secondary text-muted-foreground')}>{state === 'complete' ? <Check className="size-4" /> : state === 'current' ? <Clock3 className="size-4" /> : <Circle className="size-3" />}</span>
                    <div className="pt-0.5"><div className="flex flex-wrap items-center gap-2"><h3 className="text-lg">{title}</h3><span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{state === 'complete' ? copy.completed : state === 'current' ? copy.current : copy.upcoming}</span></div><p className="mt-1 text-muted-foreground">{body}</p></div>
                  </li>
                ))}
              </ol>
            </section>
            <aside className="ios-panel h-fit p-6"><FileCheck2 /><h2 className="mt-4 text-lg">{copy.expected}</h2><p className="mt-1 text-muted-foreground">{copy.expectedValue}</p><p className="mt-4 text-xs text-muted-foreground">{copy.prototype}</p></aside>
          </div>

          <div className="no-print mt-12 border-t pt-7"><Button asChild variant="outline"><Link href={localPath(locale, '/dashboard')}><ArrowLeft data-icon="inline-start" />{copy.returnDashboard}</Link></Button></div>
        </div>
      </main>
    </div>
  );
}

function ReceiptDatum({ label, value }: { label: string; value: string }) {
  return <div className="border-b py-5 last:border-b-0 sm:border-b sm:border-r sm:px-5 sm:first:pl-0 sm:even:border-r-0"><dt className="text-sm font-medium text-muted-foreground">{label}</dt><dd className="mt-1 break-words font-mono text-sm font-semibold sm:text-base">{value}</dd></div>;
}
