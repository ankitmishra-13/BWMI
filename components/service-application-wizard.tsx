'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Circle, Clock3, IndianRupee, KeyRound, LoaderCircle, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { ServiceApplication } from '@/db/schema';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { portalCopy, t, type TransportService } from '@/lib/services';

export function ServiceApplicationWizard({ initial, service, locale }: { initial: ServiceApplication; service: TransportService; locale: Locale }) {
  const portal = portalCopy[locale];
  const hi = locale === 'hi';
  const router = useRouter();
  const [step, setStep] = useState(Math.min(initial.currentStep, 3));
  const [confirmed, setConfirmed] = useState(initial.currentStep > 0);
  const [selection, setSelection] = useState(initial.selection || 'standard');
  const [otp, setOtp] = useState(initial.currentStep > 2 ? '123456' : '');
  const [declaration, setDeclaration] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const titles = [portal.step1, portal.step2, portal.step3, portal.step4];

  async function continueFlow() {
    if (step === 0 && !confirmed) return setError(hi ? 'आगे बढ़ने के लिए काल्पनिक रिकॉर्ड की पुष्टि करें।' : 'Confirm the synthetic record before continuing.');
    if (step === 2 && otp !== '123456') return setError(hi ? 'दिखाई देने वाला डेमो कोड 123456 दर्ज करें।' : 'Enter the visible demo code 123456.');
    if (step === 3 && !declaration) return setError(hi ? 'मॉक जमा करने की घोषणा स्वीकार करें।' : 'Accept the mock-submission declaration.');
    setSaving(true);
    setError('');
    const payload = step === 0 ? { step: 0, data: { confirmed: true } }
      : step === 1 ? { step: 1, data: { selection } }
      : step === 2 ? { step: 2, data: { otp } }
      : { step: 3, data: { declarationsAccepted: true } };
    try {
      const response = await fetch(`/api/service-applications/${initial.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error('save failed');
      if (step === 3) {
        router.push(`/${locale}/services/${service.slug}/receipt/${initial.id}`);
        return;
      }
      setStep((current) => Math.min(current + 1, 3));
      setSaving(false);
    } catch {
      setError(hi ? 'चरण सहेजा नहीं जा सका। आपका पिछला काम सुरक्षित है। फिर कोशिश करें।' : 'This step could not be saved. Your earlier work is safe. Please try again.');
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
      <section aria-labelledby="flow-step-title" className="ios-panel overflow-hidden">
        <div className="border-b bg-secondary/45 p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm font-semibold text-muted-foreground">{hi ? `चरण ${step + 1}, कुल 4` : `Step ${step + 1} of 4`}</p><span className="text-xs font-semibold uppercase tracking-wider text-success">{hi ? 'ड्राफ्ट सहेजा गया' : 'Draft saved'}</span></div>
          <Progress value={(step + 1) * 25} className="mt-3 h-2" aria-label={hi ? 'आवेदन प्रगति' : 'Application progress'} />
          <h2 id="flow-step-title" className="mt-5 text-3xl">{titles[step]}</h2>
        </div>
        <div className="p-5 sm:p-8">
          {step === 0 && <UnderstandStep locale={locale} checked={confirmed} onCheckedChange={setConfirmed} />}
          {step === 1 && <ChooseStep locale={locale} value={selection} onValueChange={setSelection} />}
          {step === 2 && <VerifyStep locale={locale} otp={otp} setOtp={setOtp} />}
          {step === 3 && <ReviewStep locale={locale} service={service} selection={selection} checked={declaration} onCheckedChange={setDeclaration} />}
          {error && <p role="alert" className="mt-6 rounded-2xl border border-destructive/30 bg-[#FFF4F2] p-4 text-sm font-medium text-destructive">{error}</p>}
        </div>
        <div className="flex flex-col-reverse gap-3 border-t bg-secondary/45 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <Button type="button" variant="ghost" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0 || saving} className="justify-center sm:justify-start"><ArrowLeft data-icon="inline-start" />{hi ? 'पीछे' : 'Back'}</Button>
          <Button type="button" onClick={continueFlow} disabled={saving} size="lg">{saving ? <LoaderCircle className="animate-spin" data-icon="inline-start" /> : step === 3 ? <CheckCircle2 data-icon="inline-start" /> : <ArrowRight data-icon="inline-start" />}{saving ? (hi ? 'सहेज रहे हैं…' : 'Saving…') : step === 3 ? (hi ? 'मॉक आवेदन जमा करें' : 'Submit mock application') : (hi ? 'सहेजें और आगे बढ़ें' : 'Save and continue')}</Button>
        </div>
      </section>

      <aside className="ios-panel h-fit p-6">
        <p className="eyebrow">{hi ? 'यात्रा मानचित्र' : 'Journey map'}</p>
        <ol className="mt-5">{titles.map((title, index) => <li key={title} className="relative grid grid-cols-[32px_1fr] gap-3 pb-6 last:pb-0">{index < titles.length - 1 && <span className="absolute left-[14px] top-7 h-[calc(100%-4px)] w-px bg-border" />}<span className={cn('relative z-10 grid size-7 place-items-center rounded-full border-2', index < step ? 'border-success bg-success text-white' : index === step ? 'border-primary bg-white text-primary' : 'border-border bg-secondary text-muted-foreground')}>{index < step ? <Check className="size-4" /> : index === step ? <Clock3 className="size-3.5" /> : <Circle className="size-2.5" />}</span><span className={cn('pt-0.5 text-sm font-semibold', index === step ? 'text-foreground' : 'text-muted-foreground')}>{title}</span></li>)}</ol>
        <Alert className="mt-7 bg-[#FFF9ED] text-[#5E4200]"><ShieldCheck /><AlertTitle>{portal.prototype}</AlertTitle><AlertDescription>{portal.heroNote}</AlertDescription></Alert>
      </aside>
    </div>
  );
}

function UnderstandStep({ locale, checked, onCheckedChange }: { locale: Locale; checked: boolean; onCheckedChange: (value: boolean) => void }) {
  const hi = locale === 'hi';
  return <div><Alert className="bg-secondary/65"><ShieldCheck /><AlertTitle>{hi ? 'पहले से भरा काल्पनिक रिकॉर्ड' : 'Prefilled synthetic record'}</AlertTitle><AlertDescription>{hi ? 'नागरिक: Aarav Sharma · वाहन: DL-01-DEMO-7812 · कार्यालय: Sample RTO, Delhi' : 'Citizen: Aarav Sharma · Vehicle: DL-01-DEMO-7812 · Office: Sample RTO, Delhi'}</AlertDescription></Alert><dl className="mt-7 border-y"><DataRow label={hi ? 'रिकॉर्ड प्रकार' : 'Record type'} value={hi ? 'केवल हैकाथॉन डेमो' : 'Hackathon demo only'} /><DataRow label={hi ? 'सरकारी जाँच' : 'Government verification'} value={hi ? 'नहीं की गई' : 'Not performed'} /><DataRow label={hi ? 'सहेजा गया डेटा' : 'Stored data'} value={hi ? 'सेवा, चयन और मॉक स्थिति' : 'Service, selection, and mock status'} /></dl><Field orientation="horizontal" className="mt-7 rounded-2xl border bg-white p-4"><Checkbox id="record-confirm" checked={checked} onCheckedChange={(value) => onCheckedChange(value === true)} /><FieldLabel htmlFor="record-confirm">{hi ? 'मैं समझता/समझती हूँ कि यह रिकॉर्ड काल्पनिक है।' : 'I understand that this record is fictional.'}</FieldLabel></Field></div>;
}

function ChooseStep({ locale, value, onValueChange }: { locale: Locale; value: string; onValueChange: (value: string) => void }) {
  const hi = locale === 'hi';
  return <div className="max-w-xl"><p className="text-muted-foreground">{hi ? 'डेमो का अगला मार्ग चुनें। चयन केवल इस काल्पनिक आवेदन में सहेजा जाता है।' : 'Choose how this demo should proceed. The selection is saved only with this fictional application.'}</p><Field className="mt-7"><FieldLabel htmlFor="service-channel">{hi ? 'सेवा विकल्प' : 'Service option'}</FieldLabel><Select value={value} onValueChange={(selected) => onValueChange(selected || 'standard')}><SelectTrigger id="service-channel" className="h-12 w-full bg-white"><SelectValue /></SelectTrigger><SelectContent><SelectGroup><SelectItem value="standard">{hi ? 'मानक डिजिटल प्रक्रिया' : 'Standard digital route'}</SelectItem><SelectItem value="priority">{hi ? 'प्राथमिकता सहायता (मॉक)' : 'Priority support (mock)'}</SelectItem><SelectItem value="assisted">{hi ? 'सहायता केंद्र मार्गदर्शन' : 'Assisted-centre guidance'}</SelectItem></SelectGroup></SelectContent></Select><FieldDescription>{hi ? 'कोई वास्तविक नियुक्ति या प्राथमिकता नहीं बनाई जाती।' : 'No real appointment or priority is created.'}</FieldDescription></Field></div>;
}

function VerifyStep({ locale, otp, setOtp }: { locale: Locale; otp: string; setOtp: (value: string) => void }) {
  const hi = locale === 'hi';
  return <div className="max-w-md"><Alert className="bg-[#FFF9ED] text-[#5E4200]"><KeyRound /><AlertTitle>{hi ? 'डेमो कोड: 123456' : 'Demo code: 123456'}</AlertTitle><AlertDescription>{hi ? 'कोई SMS नहीं भेजा जाता और कोई वास्तविक नंबर उपयोग नहीं होता।' : 'No SMS is sent and no real number is used.'}</AlertDescription></Alert><Field className="mt-7"><FieldLabel htmlFor="service-otp">{hi ? 'छह अंकों का डेमो OTP' : 'Six-digit demo OTP'}</FieldLabel><Input id="service-otp" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" maxLength={6} autoComplete="one-time-code" className="h-14 text-center font-mono text-2xl tracking-[.35em]" /></Field></div>;
}

function ReviewStep({ locale, service, selection, checked, onCheckedChange }: { locale: Locale; service: TransportService; selection: string; checked: boolean; onCheckedChange: (value: boolean) => void }) {
  const hi = locale === 'hi';
  const fee = service.feePaise ? `₹${(service.feePaise / 100).toLocaleString('en-IN')} (${hi ? 'मॉक' : 'mock'})` : (hi ? '₹0 मॉक शुल्क' : '₹0 mock fee');
  return <div><Alert className="bg-[#F1FAF5] text-[#1B5C3B]"><IndianRupee /><AlertTitle>{hi ? 'कोई भुगतान विवरण नहीं' : 'No payment details'}</AlertTitle><AlertDescription>{hi ? 'जमा करने पर केवल मॉक संदर्भ और रसीद बनेगी।' : 'Submitting creates only a mock reference and receipt.'}</AlertDescription></Alert><dl className="mt-7 border-y"><DataRow label={hi ? 'सेवा' : 'Service'} value={t(service.title, locale)} /><DataRow label={hi ? 'काल्पनिक नागरिक' : 'Synthetic citizen'} value="Aarav Sharma" /><DataRow label={hi ? 'चयन' : 'Selection'} value={selectionLabel(selection, locale)} /><DataRow label={hi ? 'नमूना शुल्क' : 'Sample fee'} value={fee} /></dl><Field orientation="horizontal" className="mt-7 rounded-2xl border bg-white p-4"><Checkbox id="submit-confirm" checked={checked} onCheckedChange={(value) => onCheckedChange(value === true)} /><FieldLabel htmlFor="submit-confirm">{hi ? 'मैं समझता/समझती हूँ कि यह किसी सरकारी सेवा में जमा नहीं होगा और कोई शुल्क नहीं लगेगा।' : 'I understand this will not be submitted to a government service and no money will be charged.'}</FieldLabel></Field></div>;
}

function DataRow({ label, value }: { label: string; value: string }) {
  return <div className="grid gap-1 border-b py-4 last:border-0 sm:grid-cols-[190px_1fr]"><dt className="text-sm font-medium text-muted-foreground">{label}</dt><dd className="font-semibold">{value}</dd></div>;
}

function selectionLabel(value: string, locale: Locale) {
  const map = {
    standard: { en: 'Standard digital route', hi: 'मानक डिजिटल प्रक्रिया' },
    priority: { en: 'Priority support (mock)', hi: 'प्राथमिकता सहायता (मॉक)' },
    assisted: { en: 'Assisted-centre guidance', hi: 'सहायता केंद्र मार्गदर्शन' },
  } as const;
  return map[value as keyof typeof map]?.[locale] || map.standard[locale];
}
