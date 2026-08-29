import { CheckCircle2, Clock3, FileCheck2, IndianRupee, LifeBuoy, Route } from 'lucide-react';
import { journeyCopy } from '@/lib/account-copy';
import type { Locale } from '@/lib/i18n';
import type { TransportService } from '@/lib/services';
import { t } from '@/lib/services';

export function JourneyPreview({ locale, service }: { locale: Locale; service: TransportService }) {
  const copy = journeyCopy[locale];
  const fee = service.feePaise === null ? (locale === 'hi' ? 'कोई डेमो शुल्क नहीं' : 'No demo fee') : new Intl.NumberFormat(locale === 'hi' ? 'hi-IN' : 'en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(service.feePaise / 100) + (locale === 'hi' ? ' मॉक' : ' mock');
  const benefits = [
    [copy.requirements, copy.requirementsBody, FileCheck2],
    [copy.draft, copy.draftBody, Route],
    [copy.recovery, copy.recoveryBody, LifeBuoy],
  ] as const;
  return (
    <section id="why-raahi" className="scroll-mt-28 route-texture overflow-hidden rounded-[2rem] text-white shadow-[0_28px_80px_rgba(10,10,10,.14)]">
      <div className="grid lg:grid-cols-[.86fr_1.14fr]">
        <div className="p-7 sm:p-10 lg:p-12">
          <p className="text-xs font-semibold uppercase tracking-[.16em] text-white/58">{copy.eyebrow}</p>
          <h2 className="mt-5 max-w-2xl text-4xl leading-[1] tracking-[-.035em] sm:text-5xl">{copy.title}</h2>
          <p className="mt-5 max-w-xl leading-7 text-white/68">{copy.body}</p>
          <details className="group mt-8 border-y border-white/15 py-4">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">{copy.compare}<span className="grid size-8 place-items-center rounded-full border border-white/20 transition-transform group-open:rotate-45">+</span></summary>
            <p className="pb-2 pt-3 text-sm leading-6 text-white/65">{copy.compareBody}</p>
          </details>
        </div>
        <div className="border-t border-white/12 bg-white/7 p-4 backdrop-blur-sm lg:border-l lg:border-t-0 sm:p-6">
          <div className="rounded-[1.6rem] border border-white/14 bg-black/28 p-5 sm:p-7">
            <div className="flex items-start justify-between gap-5">
              <div><p className="text-xs font-semibold uppercase tracking-[.14em] text-white/55">{copy.ready}</p><p className="mt-2 text-2xl font-medium">{copy.known}</p></div>
              <span className="grid size-12 place-items-center rounded-full bg-white text-black"><CheckCircle2 className="size-5" /></span>
            </div>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/14"><div className="h-full w-full rounded-full bg-white" /></div>
            <dl className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/12">
              <PreviewDatum icon={Clock3} label={copy.time} value={t(service.duration, locale)} />
              <PreviewDatum icon={IndianRupee} label={copy.fee} value={fee} />
              <PreviewDatum icon={Route} label={copy.steps} value={service.renewalFlow ? '6' : service.mode === 'transaction' ? '5' : '4'} />
              <PreviewDatum icon={CheckCircle2} label={copy.handoffs} value={copy.noHandoffs} />
            </dl>
            <ol className="mt-7">
              {benefits.map(([title, body, Icon]) => <li key={title} className="grid grid-cols-[34px_1fr] gap-3 border-b border-white/12 py-4 first:pt-0 last:border-0 last:pb-0"><span className="grid size-8 place-items-center rounded-full border border-white/20"><Icon className="size-4" /></span><div><h3 className="font-sans text-sm font-semibold">{title}</h3><p className="mt-1 text-xs leading-5 text-white/58">{body}</p></div></li>)}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

function PreviewDatum({ icon: Icon, label, value }: { icon: typeof Clock3; label: string; value: string }) {
  return <div className="bg-black/24 p-4"><dt className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.12em] text-white/48"><Icon className="size-3.5" />{label}</dt><dd className="mt-2 text-sm font-semibold text-white">{value}</dd></div>;
}
