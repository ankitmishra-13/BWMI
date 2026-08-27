import { Check, FileCheck2, IndianRupee, ShieldCheck } from 'lucide-react';
import type { Copy } from '@/lib/i18n';

export function LandingVisual({ copy }: { copy: Copy }) {
  const steps = [copy.visualStep1, copy.visualStep2, copy.visualStep3, copy.visualStep4];
  return (
    <div className="relative mx-auto w-full max-w-xl lg:mr-0" aria-label={copy.visualTitle}>
      <div className="absolute -left-4 top-14 h-36 w-1 rounded-full bg-[#C76A15] sm:-left-6" />
      <div className="overflow-hidden rounded-2xl border border-[#AFC0D0] bg-white shadow-[0_22px_60px_rgba(16,42,67,0.10)]">
        <div className="flex items-start justify-between gap-4 border-b bg-[#F8FAFC] p-5 sm:p-7">
          <div><p className="eyebrow">{copy.visualKicker}</p><h2 className="mt-1 text-2xl font-semibold text-[#102A43]">{copy.visualTitle}</h2></div>
          <div className="grid size-12 shrink-0 place-items-center rounded-full bg-[#DCEFED] text-[#0F766E]"><FileCheck2 aria-hidden="true" /></div>
        </div>
        <div className="p-5 sm:p-7">
          <ol className="grid grid-cols-4 gap-2" aria-label={copy.visualTitle}>
            {steps.map((step, index) => (
              <li key={step} className="relative text-center">
                {index < steps.length - 1 && <span aria-hidden="true" className="absolute left-1/2 top-4 h-0.5 w-full bg-[#B9D8D5]" />}
                <span className="relative mx-auto grid size-8 place-items-center rounded-full bg-[#0F766E] text-white"><Check className="size-4" aria-hidden="true" /></span>
                <span className="mt-2 block text-xs font-semibold text-[#52667A] sm:text-sm">{step}</span>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex items-center gap-4 rounded-xl border border-[#A9D2CD] bg-[#F1FAF8] p-4">
            <div className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-[#1F7A4C]"><ShieldCheck aria-hidden="true" /></div>
            <div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-wider text-[#52667A]">{copy.eligible}</p><p className="font-heading text-xl font-semibold text-[#102A43]">{copy.visualStatus}</p></div>
            <IndianRupee aria-hidden="true" className="ml-auto hidden text-[#C76A15] sm:block" />
          </div>
          <div className="mt-5 grid grid-cols-[1fr_auto] items-end gap-5"><div><div className="h-2 w-24 rounded bg-[#D9E2EC]" /><div className="mt-3 h-3 w-44 max-w-full rounded bg-[#102A43]" /></div><span className="rounded-lg border border-[#CBD5E1] px-3 py-1 text-xs font-semibold text-[#52667A]">SYNTHETIC</span></div>
        </div>
      </div>
    </div>
  );
}
