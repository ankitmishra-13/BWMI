import { Check, FileCheck2, Route, ShieldCheck } from 'lucide-react';
import type { Copy } from '@/lib/i18n';

export function LandingVisual({ copy }: { copy: Copy }) {
  const steps = [copy.visualStep1, copy.visualStep2, copy.visualStep3, copy.visualStep4];

  return (
    <figure className="reveal reveal-delay-2 mx-auto w-full max-w-[390px] lg:mr-0" aria-label={copy.visualTitle}>
      <div className="route-texture relative aspect-square overflow-hidden rounded-[2rem] border border-white/10 text-white shadow-[0_34px_90px_rgba(10,10,10,.2)]">
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-6">
          <span className="text-[11px] font-semibold uppercase tracking-[.16em] text-white/55">{copy.visualKicker}</span>
          <span className="grid size-10 place-items-center rounded-full border border-white/15 bg-white/10 backdrop-blur-md"><Route className="size-4" aria-hidden="true" /></span>
        </div>

        <svg className="absolute inset-0 size-full" viewBox="0 0 390 390" fill="none" aria-hidden="true">
          <path d="M-26 302C43 292 55 229 105 213C159 196 174 241 223 221C284 197 261 120 324 105C356 97 390 112 426 80" stroke="rgba(255,255,255,.13)" strokeWidth="38" strokeLinecap="round" />
          <path d="M-26 302C43 292 55 229 105 213C159 196 174 241 223 221C284 197 261 120 324 105C356 97 390 112 426 80" stroke="rgba(255,255,255,.86)" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 9" />
          <circle cx="105" cy="213" r="8" fill="#0A0A0A" stroke="white" strokeWidth="2" />
          <circle cx="223" cy="221" r="8" fill="#0A0A0A" stroke="white" strokeWidth="2" />
          <circle cx="324" cy="105" r="10" fill="white" />
          <circle cx="324" cy="105" r="3.5" fill="#0A0A0A" />
        </svg>

        <div className="absolute left-6 top-20 max-w-[250px]">
          <h2 className="font-heading text-4xl font-medium leading-[.98] tracking-[-.035em]">{copy.visualTitle}</h2>
        </div>

        <div className="absolute inset-x-4 bottom-4 rounded-[1.4rem] border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-black"><ShieldCheck className="size-4" aria-hidden="true" /></span>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[.13em] text-white/55">{copy.eligible}</p>
              <p className="truncate font-medium">{copy.visualStatus}</p>
            </div>
            <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-white/65"><FileCheck2 className="size-3.5" aria-hidden="true" />Mock</span>
          </div>
          <ol className="mt-4 grid grid-cols-4 gap-2" aria-label={copy.visualTitle}>
            {steps.map((step) => (
              <li key={step} className="min-w-0 text-center">
                <span className="mx-auto grid size-6 place-items-center rounded-full border border-white/15 bg-white/12"><Check className="size-3" aria-hidden="true" /></span>
                <span className="mt-1.5 block truncate text-[10px] text-white/58">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <figcaption className="mt-4 text-center text-xs text-muted-foreground">{copy.prototype}</figcaption>
    </figure>
  );
}
