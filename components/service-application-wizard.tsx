'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Circle, Clock3, IndianRupee, KeyRound, LoaderCircle, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import type { ServiceApplication } from '@/db/schema';
import { MockPaymentGateway, type MockGatewayState } from '@/components/mock-payment-gateway';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import type { Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { portalCopy, t, type TransportService } from '@/lib/services';
import { serviceApplicationDetailsSchema, type MockPaymentMethod, type ServiceApplicationDetailsInput } from '@/lib/validation';

const paymentDefault: MockPaymentMethod = 'mock-upi';

export function ServiceApplicationWizard({ initial, service, locale }: { initial: ServiceApplication; service: TransportService; locale: Locale }) {
  const portal = portalCopy[locale];
  const hi = locale === 'hi';
  const router = useRouter();
  const presentation = requestPresentation(service, locale);
  const [step, setStep] = useState(Math.min(initial.currentStep, 4));
  const [confirmed, setConfirmed] = useState(initial.currentStep > 0);
  const [otp, setOtp] = useState(initial.currentStep > 2 ? '123456' : '');
  const [declaration, setDeclaration] = useState(initial.declarationsAccepted);
  const [paymentMethod, setPaymentMethod] = useState<MockPaymentMethod>(paymentDefault);
  const [gatewayState, setGatewayState] = useState<MockGatewayState>('idle');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const form = useForm<ServiceApplicationDetailsInput>({
    resolver: zodResolver(serviceApplicationDetailsSchema),
    defaultValues: {
      contactEmail: initial.contactEmail,
      contactPhone: initial.contactPhone,
      address: initial.address,
      requestValue: initial.requestValue || presentation.defaultValue,
      requestReason: initial.requestReason,
      selection: initial.selection === 'assisted' ? 'assisted' : 'standard',
    },
  });
  const requestValue = useWatch({ control: form.control, name: 'requestValue' });
  const requestReason = useWatch({ control: form.control, name: 'requestReason' });
  const selection = useWatch({ control: form.control, name: 'selection' });
  const titles = hi
    ? ['रिकॉर्ड जाँचें', 'आवेदन विवरण', 'डेमो सत्यापन', 'बदलाव की समीक्षा', 'मॉक भुगतान']
    : ['Check record', 'Application details', 'Demo verification', 'Review changes', 'Mock payment'];
  const bodies = hi
    ? ['मौजूदा काल्पनिक रिकॉर्ड और इस डेमो की सीमा समझें।', 'जो बदलना है उसे भरें और संपर्क विवरण की जाँच करें।', 'दिखाई देने वाले कोड से इस काल्पनिक अनुरोध की पुष्टि करें।', 'जमा करने से पहले पुराने और नए विवरण की तुलना करें।', 'तरीका चुनें—किसी वित्तीय जानकारी की जरूरत नहीं है।']
    : ['Understand the current synthetic record and the limits of this demo.', 'Enter the requested change and verify the contact details.', 'Confirm this fictional request with the visible demo code.', 'Compare the old and new values before submission.', 'Choose a method—no financial information is required.'];

  async function continueFlow() {
    setError('');
    let payload: unknown;
    if (step === 0) {
      if (!confirmed) return setError(hi ? 'आगे बढ़ने से पहले काल्पनिक रिकॉर्ड की पुष्टि करें।' : 'Confirm the synthetic record before continuing.');
      payload = { step: 0, data: { confirmed: true } };
    } else if (step === 1) {
      const valid = await form.trigger();
      if (!valid) return;
      payload = { step: 1, data: form.getValues() };
    } else if (step === 2) {
      if (otp !== '123456') return setError(hi ? 'दिखाई देने वाला डेमो कोड 123456 दर्ज करें।' : 'Enter the visible demo code 123456.');
      payload = { step: 2, data: { otp } };
    } else if (step === 3) {
      if (!declaration) return setError(hi ? 'मॉक जमा करने की घोषणा स्वीकार करें।' : 'Accept the mock-submission declaration.');
      payload = { step: 3, data: { declarationsAccepted: true } };
    } else {
      payload = { step: 4, data: { paymentMethod } };
      setGatewayState('processing');
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/service-applications/${initial.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error('save failed');
      if (step === 4) {
        setGatewayState('success');
        window.setTimeout(() => router.push(`/${locale}/services/${service.slug}/receipt/${initial.id}`), 650);
        return;
      }
      setStep((current) => Math.min(current + 1, 4));
    } catch {
      setGatewayState(step === 4 ? 'failure' : 'idle');
      setError(hi ? 'यह चरण सहेजा नहीं जा सका। पिछला काम सुरक्षित है—फिर कोशिश करें।' : 'This step could not be saved. Your earlier work is safe—please try again.');
    } finally {
      setSaving(false);
    }
  }

  function previewPaymentFailure() {
    setGatewayState('failure');
    setError(hi ? 'मॉक भुगतान पूरा नहीं हुआ। कोई शुल्क नहीं लगा और आवेदन सुरक्षित है। तरीका चुनकर फिर प्रयास करें।' : 'The mock payment did not complete. Nothing was charged and the application is safe. Choose a method and try again.');
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_290px]">
      <section aria-labelledby="flow-step-title" className="ios-panel min-w-0 overflow-hidden">
        <div className="border-b bg-secondary/45 p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm font-semibold text-muted-foreground">{hi ? `चरण ${step + 1}, कुल 5` : `Step ${step + 1} of 5`}</p><span className="text-xs font-semibold uppercase tracking-wider text-success">{hi ? 'ड्राफ्ट अपने आप सहेजा जाता है' : 'Draft saves after every step'}</span></div>
          <Progress value={(step + 1) * 20} className="mt-3 h-2" aria-label={hi ? 'आवेदन प्रगति' : 'Application progress'} />
          <h2 id="flow-step-title" className="mt-5 text-3xl">{titles[step]}</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">{bodies[step]}</p>
        </div>

        <div className="p-5 sm:p-8">
          {step === 0 && <UnderstandStep locale={locale} service={service} checked={confirmed} onCheckedChange={setConfirmed} presentation={presentation} />}
          {step === 1 && <DetailsStep locale={locale} form={form} presentation={presentation} />}
          {step === 2 && <VerifyStep locale={locale} otp={otp} setOtp={setOtp} contactPhone={form.getValues('contactPhone')} />}
          {step === 3 && <ReviewStep locale={locale} service={service} presentation={presentation} values={form.getValues()} checked={declaration} onCheckedChange={setDeclaration} />}
          {step === 4 && <MockPaymentGateway amountPaise={service.feePaise ?? 0} applicationId={initial.id} locale={locale} value={paymentMethod} state={gatewayState} onValueChange={(value) => { setPaymentMethod(value); setGatewayState('idle'); setError(''); }} onPreviewFailure={previewPaymentFailure} />}
          {error && <p role="alert" className="mt-6 rounded-2xl border border-destructive/30 bg-background p-4 text-sm font-medium text-destructive">{error}</p>}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t bg-secondary/45 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <Button type="button" variant="ghost" onClick={() => { setStep((current) => Math.max(0, current - 1)); setError(''); setGatewayState('idle'); }} disabled={step === 0 || saving} className="justify-center sm:justify-start"><ArrowLeft data-icon="inline-start" />{hi ? 'पीछे' : 'Back'}</Button>
          <Button type="button" onClick={continueFlow} disabled={saving || gatewayState === 'success'} size="lg">
            {saving ? <LoaderCircle className="animate-spin" data-icon="inline-start" /> : step === 4 ? <IndianRupee data-icon="inline-start" /> : step === 3 ? <CheckCircle2 data-icon="inline-start" /> : <ArrowRight data-icon="inline-start" />}
            {saving ? (step === 4 ? (hi ? 'मॉक भुगतान प्रोसेस हो रहा है…' : 'Processing mock payment…') : (hi ? 'सहेज रहे हैं…' : 'Saving…')) : step === 4 ? (hi ? 'मॉक भुगतान पूरा करें' : 'Complete mock payment') : step === 3 ? (hi ? 'मॉक भुगतान पर जाएँ' : 'Continue to mock payment') : (hi ? 'सहेजें और आगे बढ़ें' : 'Save and continue')}
          </Button>
        </div>
      </section>

      <aside className="ios-panel h-fit p-6 lg:sticky lg:top-24">
        <p className="eyebrow">{hi ? 'यात्रा मानचित्र' : 'Journey map'}</p>
        <ol className="mt-5">{titles.map((title, index) => <li key={title} className="relative grid grid-cols-[32px_1fr] gap-3 pb-6 last:pb-0">{index < titles.length - 1 && <span className="absolute left-[14px] top-7 h-[calc(100%-4px)] w-px bg-border" />}<span className={cn('relative z-10 grid size-7 place-items-center rounded-full border-2', index < step ? 'border-success bg-success text-white' : index === step ? 'border-primary bg-white text-primary' : 'border-border bg-secondary text-muted-foreground')}>{index < step ? <Check className="size-4" /> : index === step ? <Clock3 className="size-3.5" /> : <Circle className="size-2.5" />}</span><span className={cn('pt-0.5 text-sm font-semibold', index === step ? 'text-foreground' : 'text-muted-foreground')}>{title}</span></li>)}</ol>
        <Separator className="my-6" />
        <p className="text-sm font-semibold">{hi ? 'अभी भरा जा रहा है' : 'Currently being completed'}</p>
        <p className="mt-2 break-words text-sm text-muted-foreground">{step === 1 ? `${presentation.requestLabel}: ${requestValue || '—'}` : step === 3 ? `${requestReason} · ${selectionLabel(selection, locale)}` : bodies[step]}</p>
        <Alert className="mt-6 bg-secondary"><ShieldCheck /><AlertTitle>{portal.prototype}</AlertTitle><AlertDescription>{portal.heroNote}</AlertDescription></Alert>
      </aside>
    </div>
  );
}

type RequestPresentation = { currentLabel: string; currentValue: string; requestLabel: string; requestDescription: string; defaultValue: string; multiline?: boolean };

function UnderstandStep({ locale, service, checked, onCheckedChange, presentation }: { locale: Locale; service: TransportService; checked: boolean; onCheckedChange: (value: boolean) => void; presentation: RequestPresentation }) {
  const hi = locale === 'hi';
  return <div><Alert className="bg-secondary"><ShieldCheck /><AlertTitle>{hi ? 'पहले से भरा काल्पनिक रिकॉर्ड' : 'Prefilled synthetic record'}</AlertTitle><AlertDescription>{hi ? 'नागरिक: Aarav Sharma · वाहन: DL-01-DEMO-7812 · कार्यालय: Sample RTO, Delhi' : 'Citizen: Aarav Sharma · Vehicle: DL-01-DEMO-7812 · Office: Sample RTO, Delhi'}</AlertDescription></Alert><dl className="mt-7 border-y"><DataRow label={hi ? 'सेवा' : 'Service'} value={t(service.title, locale)} /><DataRow label={presentation.currentLabel} value={presentation.currentValue} /><DataRow label={hi ? 'अगले चरण में' : 'Next step'} value={hi ? 'नया काल्पनिक विवरण दर्ज करें और तुलना करें' : 'Enter the new synthetic value and compare it'} /><DataRow label={hi ? 'सरकारी जाँच' : 'Government verification'} value={hi ? 'नहीं की गई' : 'Not performed'} /></dl><Field orientation="horizontal" className="mt-7 rounded-2xl border bg-white p-4"><Checkbox id="record-confirm" checked={checked} onCheckedChange={(value) => onCheckedChange(value === true)} /><FieldLabel htmlFor="record-confirm">{hi ? 'मैं समझता/समझती हूँ कि यह रिकॉर्ड और परिणाम पूरी तरह काल्पनिक हैं।' : 'I understand this record and every result are entirely synthetic.'}</FieldLabel></Field></div>;
}

function DetailsStep({ locale, form, presentation }: { locale: Locale; form: ReturnType<typeof useForm<ServiceApplicationDetailsInput>>; presentation: RequestPresentation }) {
  const hi = locale === 'hi';
  const reason = useWatch({ control: form.control, name: 'requestReason' });
  const route = useWatch({ control: form.control, name: 'selection' });
  return <FieldGroup>
    <Alert className="bg-secondary"><CheckCircle2 /><AlertTitle>{hi ? 'क्या बदलेगा' : 'What will change'}</AlertTitle><AlertDescription>{presentation.currentLabel}: {presentation.currentValue}</AlertDescription></Alert>
    <Field data-invalid={Boolean(form.formState.errors.requestValue)}><FieldLabel htmlFor="request-value">{presentation.requestLabel}</FieldLabel>{presentation.multiline ? <Textarea id="request-value" {...form.register('requestValue')} aria-invalid={Boolean(form.formState.errors.requestValue)} /> : <Input id="request-value" {...form.register('requestValue')} aria-invalid={Boolean(form.formState.errors.requestValue)} />}<FieldDescription>{presentation.requestDescription}</FieldDescription><FieldError errors={[form.formState.errors.requestValue]} /></Field>
    <FieldGroup className="grid sm:grid-cols-2">
      <Field data-invalid={Boolean(form.formState.errors.requestReason)}><FieldLabel htmlFor="request-reason">{hi ? 'अनुरोध का कारण' : 'Purpose of request'}</FieldLabel><Select value={reason} onValueChange={(value) => form.setValue('requestReason', value || 'Citizen record update', { shouldValidate: true })}><SelectTrigger id="request-reason" className="h-12 w-full bg-white"><SelectValue /></SelectTrigger><SelectContent><SelectGroup><SelectItem value="Citizen record update">{hi ? 'नागरिक रिकॉर्ड अपडेट' : 'Citizen record update'}</SelectItem><SelectItem value="Correction of fictional details">{hi ? 'काल्पनिक विवरण में सुधार' : 'Correction of fictional details'}</SelectItem><SelectItem value="Replacement or recovery">{hi ? 'बदलाव या पुनर्प्राप्ति' : 'Replacement or recovery'}</SelectItem></SelectGroup></SelectContent></Select><FieldError errors={[form.formState.errors.requestReason]} /></Field>
      <Field data-invalid={Boolean(form.formState.errors.selection)}><FieldLabel htmlFor="service-route">{hi ? 'सेवा मार्ग' : 'Service route'}</FieldLabel><Select value={route} onValueChange={(value) => form.setValue('selection', value === 'assisted' ? 'assisted' : 'standard', { shouldValidate: true })}><SelectTrigger id="service-route" className="h-12 w-full bg-white"><SelectValue /></SelectTrigger><SelectContent><SelectGroup><SelectItem value="standard">{hi ? 'ऑनलाइन स्व-सेवा' : 'Online self-service'}</SelectItem><SelectItem value="assisted">{hi ? 'सहायता केंद्र मार्गदर्शन' : 'Assisted-centre guidance'}</SelectItem></SelectGroup></SelectContent></Select><FieldError errors={[form.formState.errors.selection]} /></Field>
    </FieldGroup>
    <Separator />
    <div><h3 className="font-sans text-base font-semibold">{hi ? 'आवेदन संपर्क' : 'Application contact'}</h3><p className="mt-1 text-sm text-muted-foreground">{hi ? 'ये काल्पनिक विवरण केवल इस डेमो आवेदन पर सहेजे जाते हैं।' : 'These fictional details are saved only to this demo application.'}</p></div>
    <FieldGroup className="grid sm:grid-cols-2">
      <Field data-invalid={Boolean(form.formState.errors.contactEmail)}><FieldLabel htmlFor="service-email">{hi ? 'डेमो ईमेल' : 'Demo email'}</FieldLabel><Input id="service-email" type="email" {...form.register('contactEmail')} aria-invalid={Boolean(form.formState.errors.contactEmail)} /><FieldError errors={[form.formState.errors.contactEmail]} /></Field>
      <Field data-invalid={Boolean(form.formState.errors.contactPhone)}><FieldLabel htmlFor="service-phone">{hi ? 'काल्पनिक मोबाइल' : 'Synthetic mobile'}</FieldLabel><Input id="service-phone" type="tel" inputMode="tel" {...form.register('contactPhone')} aria-invalid={Boolean(form.formState.errors.contactPhone)} /><FieldError errors={[form.formState.errors.contactPhone]} /></Field>
    </FieldGroup>
    <Field data-invalid={Boolean(form.formState.errors.address)}><FieldLabel htmlFor="service-address">{hi ? 'काल्पनिक पत्राचार पता' : 'Synthetic correspondence address'}</FieldLabel><Textarea id="service-address" {...form.register('address')} aria-invalid={Boolean(form.formState.errors.address)} /><FieldError errors={[form.formState.errors.address]} /></Field>
  </FieldGroup>;
}

function VerifyStep({ locale, otp, setOtp, contactPhone }: { locale: Locale; otp: string; setOtp: (value: string) => void; contactPhone: string }) {
  const hi = locale === 'hi';
  return <div className="max-w-lg"><Alert className="bg-secondary"><KeyRound /><AlertTitle>{hi ? 'डेमो कोड: 123456' : 'Demo code: 123456'}</AlertTitle><AlertDescription>{hi ? `${contactPhone} पर कोई SMS नहीं भेजा जाता। कोड केवल यात्रा पूरी करने के लिए दिखाई देता है।` : `No SMS is sent to ${contactPhone}. The code is visible only so the journey can be completed.`}</AlertDescription></Alert><Field className="mt-7"><FieldLabel htmlFor="service-otp">{hi ? 'छह अंकों का डेमो OTP' : 'Six-digit demo OTP'}</FieldLabel><Input id="service-otp" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" maxLength={6} autoComplete="one-time-code" className="h-14 text-center font-mono text-2xl tracking-[.35em]" /><FieldDescription>{hi ? 'दर्ज करें: 123456' : 'Enter 123456'}</FieldDescription></Field></div>;
}

function ReviewStep({ locale, service, presentation, values, checked, onCheckedChange }: { locale: Locale; service: TransportService; presentation: RequestPresentation; values: ServiceApplicationDetailsInput; checked: boolean; onCheckedChange: (value: boolean) => void }) {
  const hi = locale === 'hi';
  const fee = new Intl.NumberFormat(hi ? 'hi-IN' : 'en-IN', { style: 'currency', currency: 'INR' }).format((service.feePaise ?? 0) / 100);
  return <div className="flex flex-col gap-6"><Alert className="bg-secondary"><CheckCircle2 /><AlertTitle>{hi ? 'पुराना और नया विवरण' : 'Before and after'}</AlertTitle><AlertDescription>{hi ? 'यही बदलाव मॉक रसीद और आवेदन में सहेजा जाएगा।' : 'This exact change will be saved to the mock application and receipt.'}</AlertDescription></Alert><div className="grid gap-3 sm:grid-cols-2"><div className="rounded-2xl border bg-secondary p-5"><p className="eyebrow">{hi ? 'पहले' : 'Before'}</p><p className="mt-3 break-words font-semibold">{presentation.currentValue}</p></div><div className="rounded-2xl border border-foreground/25 bg-white p-5"><p className="eyebrow">{hi ? 'अनुरोधित बदलाव' : 'Requested change'}</p><p className="mt-3 break-words font-semibold">{values.requestValue}</p></div></div><dl className="border-y"><ReviewRow label={hi ? 'कारण' : 'Purpose'} value={reasonLabel(values.requestReason, locale)} /><ReviewRow label={hi ? 'सेवा मार्ग' : 'Service route'} value={selectionLabel(values.selection, locale)} /><ReviewRow label={hi ? 'ईमेल' : 'Email'} value={values.contactEmail} /><ReviewRow label={hi ? 'मोबाइल' : 'Mobile'} value={values.contactPhone} /><ReviewRow label={hi ? 'पता' : 'Address'} value={values.address} /><ReviewRow label={hi ? 'मॉक शुल्क' : 'Mock fee'} value={`${fee} (${hi ? 'मॉक' : 'mock'})`} /></dl><Field orientation="horizontal" className="rounded-2xl border bg-white p-4"><Checkbox id="submit-confirm" checked={checked} onCheckedChange={(value) => onCheckedChange(value === true)} /><FieldLabel htmlFor="submit-confirm">{hi ? 'मैंने बदलाव जाँचे हैं और समझता/समझती हूँ कि कोई सरकारी आवेदन या वास्तविक भुगतान नहीं होगा।' : 'I reviewed the changes and understand that no government application or real payment will occur.'}</FieldLabel></Field></div>;
}

function DataRow({ label, value }: { label: string; value: string }) { return <div className="grid gap-1 border-b py-4 last:border-0 sm:grid-cols-[190px_1fr]"><dt className="text-sm font-medium text-muted-foreground">{label}</dt><dd className="break-words font-semibold">{value}</dd></div>; }
function ReviewRow({ label, value }: { label: string; value: string }) { return <div className="grid gap-1 border-b py-3 last:border-0 sm:grid-cols-[180px_1fr]"><dt className="text-sm font-medium text-muted-foreground">{label}</dt><dd className="break-words font-semibold">{value}</dd></div>; }

function selectionLabel(value: string, locale: Locale) { return value === 'assisted' ? (locale === 'hi' ? 'सहायता केंद्र मार्गदर्शन' : 'Assisted-centre guidance') : (locale === 'hi' ? 'ऑनलाइन स्व-सेवा' : 'Online self-service'); }
function reasonLabel(value: string, locale: Locale) { const labels = { 'Citizen record update': { en: 'Citizen record update', hi: 'नागरिक रिकॉर्ड अपडेट' }, 'Correction of fictional details': { en: 'Correction of fictional details', hi: 'काल्पनिक विवरण में सुधार' }, 'Replacement or recovery': { en: 'Replacement or recovery', hi: 'बदलाव या पुनर्प्राप्ति' } } as const; return labels[value as keyof typeof labels]?.[locale] ?? value; }

function requestPresentation(service: TransportService, locale: Locale): RequestPresentation {
  const hi = locale === 'hi';
  if (service.slug === 'update-mobile-number') return { currentLabel: hi ? 'वर्तमान काल्पनिक मोबाइल' : 'Current synthetic mobile', currentValue: '+91 98765 78120', requestLabel: hi ? 'नया काल्पनिक मोबाइल नंबर' : 'New synthetic mobile number', requestDescription: hi ? 'डेमो प्रारूप उपयोग करें: +91 91234 56789' : 'Use the demo format: +91 91234 56789', defaultValue: '+91 91234 56789' };
  if (service.slug === 'change-address-rc') return { currentLabel: hi ? 'RC पर वर्तमान काल्पनिक पता' : 'Current synthetic RC address', currentValue: '24 Sample Marg, New Delhi 110001', requestLabel: hi ? 'नया काल्पनिक RC पता' : 'New synthetic RC address', requestDescription: hi ? 'यह किसी वास्तविक RC को नहीं बदलता।' : 'This does not alter a real RC.', defaultValue: '18 Demo Avenue, New Delhi 110002', multiline: true };
  if (service.slug === 'echallan') return { currentLabel: hi ? 'काल्पनिक चालान' : 'Synthetic challan', currentValue: 'DEMO-1042 · DL-01-DEMO-7812', requestLabel: hi ? 'भुगतान के लिए काल्पनिक रिकॉर्ड' : 'Synthetic record to settle', requestDescription: hi ? 'केवल डेमो चालान संदर्भ उपयोग करें।' : 'Use only the displayed demo challan reference.', defaultValue: 'DEMO-1042 · DL-01-DEMO-7812' };
  if (service.slug.includes('duplicate')) return { currentLabel: hi ? 'मौजूदा काल्पनिक दस्तावेज़' : 'Existing synthetic document', currentValue: 'DL-••-2014-••7812 · Active', requestLabel: hi ? 'बदलने का कारण' : 'Replacement request', requestDescription: hi ? 'कोई वास्तविक दस्तावेज़ नंबर दर्ज न करें।' : 'Do not enter any real document number.', defaultValue: 'Replace a damaged synthetic document', multiline: true };
  if (service.category === 'licence') return { currentLabel: hi ? 'काल्पनिक लाइसेंस रिकॉर्ड' : 'Synthetic licence record', currentValue: 'DL-••-2014-••7812 · LMV, MCWG', requestLabel: hi ? 'अनुरोधित लाइसेंस सेवा' : 'Requested licence service', requestDescription: hi ? 'नमूना वाहन श्रेणी या कार्यालय चुनें।' : 'Use a sample vehicle class or office.', defaultValue: 'LMV — Light motor vehicle' };
  return { currentLabel: hi ? 'काल्पनिक वाहन रिकॉर्ड' : 'Synthetic vehicle record', currentValue: 'DL-01-DEMO-7812 · Sample RTO, Delhi', requestLabel: hi ? 'अनुरोधित सेवा विवरण' : 'Requested service detail', requestDescription: hi ? 'केवल काल्पनिक जानकारी दर्ज करें।' : 'Enter fictional information only.', defaultValue: service.slug === 'vehicle-tax' ? 'Annual tax period 2026–27' : 'Standard synthetic service request', multiline: service.category === 'vehicle' };
}
