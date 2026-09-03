'use client';

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, FileCheck2, IndianRupee, LoaderCircle, LockKeyhole, RefreshCcw, ShieldCheck, Upload, WifiOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { AssistantSheet } from '@/components/assistant-sheet';
import { MockPaymentGateway, type MockGatewayState } from '@/components/mock-payment-gateway';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import type { ApplicationBundle } from '@/lib/data';
import type { Copy, Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { contactSchema, type ContactInput, type MockPaymentMethod } from '@/lib/validation';

type DocumentMeta = { documentType: 'Address proof' | 'Medical certificate'; fileName: string; sizeBytes: number };

export function RenewalWizard({ initial, locale, copy }: { initial: ApplicationBundle; locale: Locale; copy: Copy }) {
  const router = useRouter();
  const [step, setStep] = useState(Math.min(initial.application.currentStep, 5));
  const [confirmed, setConfirmed] = useState(false);
  const [documents, setDocuments] = useState<DocumentMeta[]>(initial.documents.map((item) => ({ documentType: item.documentType as DocumentMeta['documentType'], fileName: item.fileName, sizeBytes: item.sizeBytes })));
  const [otp, setOtp] = useState('');
  const [declarationOne, setDeclarationOne] = useState(initial.application.declarationsAccepted);
  const [declarationTwo, setDeclarationTwo] = useState(initial.application.declarationsAccepted);
  const [paymentMethod, setPaymentMethod] = useState<MockPaymentMethod>('mock-upi');
  const [gatewayState, setGatewayState] = useState<MockGatewayState>('idle');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [online, setOnline] = useState(true);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { email: initial.application.contactEmail, phone: initial.application.contactPhone, address: initial.application.address },
  });
  const draftKey = `renewal-draft:${initial.application.id}`;

  useEffect(() => {
    const updateConnection = () => setOnline(navigator.onLine);
    updateConnection();
    window.addEventListener('online', updateConnection);
    window.addEventListener('offline', updateConnection);
    return () => { window.removeEventListener('online', updateConnection); window.removeEventListener('offline', updateConnection); };
  }, []);

  useEffect(() => {
    const raw = sessionStorage.getItem(draftKey);
    if (!raw) return;
    try {
      const draft = JSON.parse(raw) as Partial<ContactInput> & { step?: number; documents?: DocumentMeta[]; otp?: string; confirmed?: boolean; declarationOne?: boolean; declarationTwo?: boolean; paymentMethod?: MockPaymentMethod };
      if (draft.email) form.setValue('email', draft.email);
      if (draft.phone) form.setValue('phone', draft.phone);
      if (draft.address) form.setValue('address', draft.address);
      if (draft.documents) setDocuments(draft.documents);
      if (draft.otp) setOtp(draft.otp);
      if (typeof draft.confirmed === 'boolean') setConfirmed(draft.confirmed);
      if (typeof draft.declarationOne === 'boolean') setDeclarationOne(draft.declarationOne);
      if (typeof draft.declarationTwo === 'boolean') setDeclarationTwo(draft.declarationTwo);
      if (draft.paymentMethod) setPaymentMethod(draft.paymentMethod);
      if (typeof draft.step === 'number') setStep(Math.max(0, Math.min(draft.step, initial.application.currentStep, 5)));
    } catch { sessionStorage.removeItem(draftKey); }
  }, [draftKey, form, initial.application.currentStep]);

  useEffect(() => {
    // React Hook Form intentionally exposes an imperative subscription for draft persistence.
    // eslint-disable-next-line react-hooks/incompatible-library
    const subscription = form.watch((values) => {
      sessionStorage.setItem(draftKey, JSON.stringify({ ...values, step, documents, otp, confirmed, declarationOne, declarationTwo, paymentMethod }));
    });
    sessionStorage.setItem(draftKey, JSON.stringify({ ...form.getValues(), step, documents, otp, confirmed, declarationOne, declarationTwo, paymentMethod }));
    return () => subscription.unsubscribe();
  }, [confirmed, declarationOne, declarationTwo, documents, draftKey, form, otp, paymentMethod, step]);

  const labels = [copy.step0, copy.step1, copy.step2, copy.step3, copy.step4, copy.step5];
  async function recordRecovery(eventType: 'network' | 'otp' | 'payment', detail: string) {
    await fetch(`/api/applications/${initial.application.id}/recovery`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ eventType, detail }) }).catch(() => undefined);
  }
  async function saveAndContinue() {
    setError('');
    let payload: unknown;
    if (step === 0) {
      if (!confirmed) return setError(copy.errorEligibility);
      payload = { step: 0, data: { confirmed: true } };
    } else if (step === 1) {
      const valid = await form.trigger();
      if (!valid) return;
      payload = { step: 1, data: form.getValues() };
    } else if (step === 2) {
      if (!documents.some((item) => item.documentType === 'Address proof')) return setError(copy.errorDocument);
      if (initial.readiness?.medicalRequired && !documents.some((item) => item.documentType === 'Medical certificate')) return setError(locale === 'hi' ? 'आपकी तैयारी योजना के अनुसार नमूना मेडिकल प्रमाणपत्र चुनें।' : 'Choose the sample medical certificate identified in your readiness plan.');
      payload = { step: 2, data: { documents } };
    } else if (step === 3) {
      if (otp !== '123456') { void recordRecovery('otp', 'Incorrect visible demo OTP; draft remained saved.'); return setError(copy.errorOtp); }
      payload = { step: 3, data: { otp } };
    } else if (step === 4) {
      if (!declarationOne || !declarationTwo) return setError(copy.errorDeclarations);
      payload = { step: 4, data: { declarationsAccepted: true } };
    } else {
      payload = { step: 5, data: { paymentMethod } };
      setGatewayState('processing');
    }
    setSaving(true);
    try {
      const response = await fetch(`/api/applications/${initial.application.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error('save failed');
      setLastSaved(new Intl.DateTimeFormat(locale === 'hi' ? 'hi-IN' : 'en-IN', { hour: 'numeric', minute: '2-digit' }).format(new Date()));
      if (step === 5) {
        sessionStorage.removeItem(draftKey);
        setGatewayState('success');
        window.setTimeout(() => router.push(`/${locale}/status/${initial.application.id}`), 650);
      } else {
        setStep((value) => Math.min(value + 1, 5));
        router.refresh();
      }
    } catch { void recordRecovery(step === 5 ? 'payment' : 'network', step === 5 ? 'Mock payment request interrupted; no charge made.' : 'Save request interrupted; browser draft retained.'); setGatewayState(step === 5 ? 'failure' : 'idle'); setError(copy.errorGeneric); } finally { setSaving(false); }
  }

  function addDocument(documentType: DocumentMeta['documentType'], file: File | undefined) {
    if (!file) return;
    if (file.size > 5_000_000) return setError(locale === 'hi' ? '5 MB से छोटी नमूना फ़ाइल चुनें।' : 'Choose a sample file smaller than 5 MB.');
    setDocuments((items) => [...items.filter((item) => item.documentType !== documentType), { documentType, fileName: file.name, sizeBytes: file.size }]);
    setError('');
  }

  return (
    <div>
      {!online && <Alert className="mb-6 bg-[#FFF9ED] text-warning"><WifiOff /><AlertTitle>{locale === 'hi' ? 'आप ऑफ़लाइन हैं—ड्राफ्ट सुरक्षित है' : 'You are offline—your draft is safe'}</AlertTitle><AlertDescription>{locale === 'hi' ? 'इंटरनेट वापस आने पर इसी चरण से जारी रखें।' : 'Continue from this step when your connection returns.'}</AlertDescription></Alert>}
      <div className="mb-8 lg:hidden"><p className="text-sm font-semibold text-muted-foreground">{copy.stepOf.replace('{current}', String(step + 1)).replace('{total}', '6')}</p><Progress value={((step + 1) / 6) * 100} className="mt-3 h-2" /></div>
      <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_250px]">
        <aside className="hidden lg:block"><ol className="flex flex-col">
          {labels.map((label, index) => <li key={label} className="relative flex min-h-16 gap-3 pb-3"><span aria-hidden="true" className={cn('relative z-10 grid size-8 shrink-0 place-items-center rounded-full border-2 text-sm font-bold', index < step ? 'border-success bg-success text-white' : index === step ? 'border-primary bg-white text-primary' : 'border-border bg-secondary text-muted-foreground')}>{index < step ? <Check className="size-4" /> : index + 1}</span>{index < labels.length - 1 && <span aria-hidden="true" className="absolute left-[15px] top-8 h-[calc(100%-10px)] w-0.5 bg-border" />}<span className={cn('pt-1 text-sm font-semibold', index === step ? 'text-foreground' : 'text-muted-foreground')}>{label}</span></li>)}
        </ol></aside>

        <section aria-labelledby="step-title" className="ios-panel min-w-0 overflow-hidden">
          <div className="border-b p-5 sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="eyebrow">{copy.stepOf.replace('{current}', String(step + 1)).replace('{total}', '6')}</p><h2 id="step-title" className="mt-2 text-2xl sm:text-3xl">{stepTitle(step, copy)}</h2><p className="mt-2 max-w-2xl text-muted-foreground">{stepBody(step, copy)}</p></div><AssistantSheet applicationId={initial.application.id} step={step} locale={locale} copy={copy} /></div>
          </div>
          <div className="p-5 sm:p-7">{renderStep()}</div>
          {error && <p role="alert" className="mx-5 mb-2 rounded-2xl border border-destructive/30 bg-[#FFF2F0] p-4 text-sm font-medium text-destructive sm:mx-7">{error}</p>}
          <div className="flex flex-col-reverse gap-3 border-t bg-secondary/45 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <Button type="button" variant="ghost" disabled={step === 0 || saving} onClick={() => { setStep((value) => Math.max(0, value - 1)); setGatewayState('idle'); setError(''); }}><ArrowLeft data-icon="inline-start" />{copy.back}</Button>
            <div className="flex items-center justify-end gap-4"><span aria-live="polite" className="hidden text-sm text-muted-foreground sm:inline">{saving ? copy.saving : lastSaved ? (locale === 'hi' ? `${lastSaved} पर सहेजा · बाद में जारी रख सकते हैं` : `Saved at ${lastSaved} · safe to resume`) : copy.saved}</span><Button type="button" disabled={saving || gatewayState === 'success'} onClick={saveAndContinue} size="lg">{saving ? <LoaderCircle className="animate-spin" data-icon="inline-start" /> : step === 5 ? <IndianRupee data-icon="inline-start" /> : <ArrowRight data-icon="inline-start" />}{saving && step === 5 ? (locale === 'hi' ? 'मॉक भुगतान प्रोसेस हो रहा है…' : 'Processing mock payment…') : step === 5 ? copy.submitPayment : copy.continue}</Button></div>
          </div>
        </section>

        <aside className="hidden xl:block"><div className="ios-panel sticky top-24 p-5"><p className="text-sm font-semibold">{copy.whatYouNeed}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{helperText(step, locale)}</p><div className="mt-5 flex items-start gap-2 text-xs text-muted-foreground"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" />{copy.prototype}</div>{step > 0 && step < 5 && <Button type="button" variant="ghost" size="sm" className="mt-5 h-auto whitespace-normal text-left" onClick={() => { void recordRecovery('network', 'Citizen previewed the network recovery state.'); setError(locale === 'hi' ? 'कनेक्शन रुकने का उदाहरण: आपका पूरा किया हुआ चरण सुरक्षित है। इंटरनेट वापस आने पर फिर प्रयास करें।' : 'Connection interruption example: your completed step is safe. Try again when the internet returns.'); }}><RefreshCcw />{locale === 'hi' ? 'रिकवरी का उदाहरण देखें' : 'Preview recovery'}</Button>}</div></aside>
      </div>
    </div>
  );

  function renderStep() {
    if (step === 0) return <div className="flex flex-col gap-6"><Alert className="bg-[#F1FAF5] text-[#1B5C3B]"><CheckCircle2 /><AlertTitle>{initial.readiness ? (locale === 'hi' ? 'आपकी तैयारी योजना जुड़ी है' : 'Your readiness plan is attached') : copy.eligible}</AlertTitle><AlertDescription>{initial.readiness ? (locale === 'hi' ? `${initial.readiness.ageBand === 'under-40' ? '18–39' : initial.readiness.ageBand === '40-59' ? '40–59' : '60+'} आयु · ${initial.readiness.licenceType === 'transport' ? 'परिवहन' : 'निजी'} लाइसेंस · ${initial.readiness.medicalRequired ? 'मेडिकल फॉर्म आवश्यक' : 'स्व-घोषणा'}` : `${initial.readiness.ageBand === 'under-40' ? 'Age 18–39' : initial.readiness.ageBand === '40-59' ? 'Age 40–59' : 'Age 60+'} · ${initial.readiness.licenceType === 'transport' ? 'Transport' : 'Private'} licence · ${initial.readiness.medicalRequired ? 'Medical form flagged' : 'Self-declaration flagged'}`) : copy.eligibilityBody}</AlertDescription></Alert><div><h3 className="text-lg">{copy.requirementsTitle}</h3><ul className="mt-4 flex flex-col gap-3">{[copy.requirementA, initial.readiness?.medicalRequired ? (locale === 'hi' ? 'नमूना फॉर्म 1A मेडिकल प्रमाणपत्र' : 'Sample Form 1A medical certificate') : copy.requirementB, copy.requirementC].map((item) => <li key={item} className="flex gap-3 text-muted-foreground"><Check className="mt-1 size-4 shrink-0 text-foreground" />{item}</li>)}</ul></div><Field orientation="horizontal" className="rounded-2xl border bg-white p-4"><Checkbox id="eligibility-confirm" checked={confirmed} onCheckedChange={(value) => setConfirmed(value === true)} /><FieldLabel htmlFor="eligibility-confirm" className="font-medium">{copy.confirmEligibility}</FieldLabel></Field></div>;
    if (step === 1) return <FieldGroup><Field data-invalid={Boolean(form.formState.errors.email)}><FieldLabel htmlFor="email">{copy.email}</FieldLabel><Input id="email" type="email" autoComplete="email" {...form.register('email')} className="h-12 bg-white" /><FieldDescription>{copy.detailsBody}</FieldDescription><FieldError errors={[form.formState.errors.email]} /></Field><Field data-invalid={Boolean(form.formState.errors.phone)}><FieldLabel htmlFor="phone">{copy.phone}</FieldLabel><Input id="phone" type="tel" inputMode="tel" {...form.register('phone')} className="h-12 bg-white" /><FieldError errors={[form.formState.errors.phone]} /></Field><Field data-invalid={Boolean(form.formState.errors.address)}><FieldLabel htmlFor="address">{copy.fullAddress}</FieldLabel><Textarea id="address" {...form.register('address')} className="min-h-28 bg-white" /><FieldError errors={[form.formState.errors.address]} /></Field></FieldGroup>;
    if (step === 2) return <div className="flex flex-col gap-5"><Alert className="bg-secondary/65"><Upload /><AlertTitle>{copy.documentsTitle}</AlertTitle><AlertDescription>{initial.readiness ? (locale === 'hi' ? 'आपकी तैयारी योजना के आधार पर केवल फ़ाइल का नाम और आकार सहेजा जाएगा।' : 'Based on your readiness plan, only the filename and size will be saved.') : copy.documentsBody}</AlertDescription></Alert><Field><FieldLabel htmlFor="address-proof">{copy.addressProof}</FieldLabel><Input id="address-proof" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => addDocument('Address proof', event.target.files?.[0])} className="h-auto min-h-12 cursor-pointer bg-white file:mr-3 file:rounded-full file:border-0 file:bg-secondary file:px-3 file:py-2 file:font-semibold file:text-foreground" /><FieldDescription>PDF, JPG or PNG · max 5 MB · metadata only</FieldDescription></Field>{initial.readiness?.medicalRequired && <Field><FieldLabel htmlFor="medical-certificate">{locale === 'hi' ? 'नमूना मेडिकल प्रमाणपत्र' : 'Sample medical certificate'}</FieldLabel><Input id="medical-certificate" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => addDocument('Medical certificate', event.target.files?.[0])} className="h-auto min-h-12 cursor-pointer bg-white file:mr-3 file:rounded-full file:border-0 file:bg-secondary file:px-3 file:py-2 file:font-semibold file:text-foreground" /><FieldDescription>{locale === 'hi' ? 'तैयारी योजना में फॉर्म 1A चिह्नित है · मेटाडेटा मात्र' : 'Form 1A was flagged in your readiness plan · metadata only'}</FieldDescription></Field>}{documents.map((document) => <div key={document.documentType} className="flex items-center gap-4 rounded-2xl border bg-secondary/45 p-4"><FileCheck2 className="size-6 shrink-0 text-success" /><div className="min-w-0"><p className="truncate font-semibold">{document.fileName}</p><p className="text-sm text-muted-foreground">{document.documentType} · {(document.sizeBytes / 1024).toFixed(1)} KB · {copy.selectedFile}</p></div><Button type="button" variant="ghost" onClick={() => setDocuments((items) => items.filter((item) => item.documentType !== document.documentType))} className="ml-auto text-destructive">{copy.remove}</Button></div>)}</div>;
    if (step === 3) return <div className="max-w-md"><Alert className="bg-[#FFF9ED] text-[#5E4200]"><LockKeyhole /><AlertTitle>{copy.demoCode}</AlertTitle><AlertDescription>{copy.otpBody}</AlertDescription></Alert><Field className="mt-6"><FieldLabel htmlFor="otp">{copy.otp}</FieldLabel><Input id="otp" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" maxLength={6} className="h-14 text-center font-mono text-2xl tracking-[.35em]" /></Field></div>;
    if (step === 4) return <div className="flex flex-col gap-6"><ReviewRow label={copy.holder} value={initial.licence.holderName} /><ReviewRow label={copy.email} value={form.getValues('email')} /><ReviewRow label={copy.phone} value={form.getValues('phone')} /><ReviewRow label={copy.fullAddress} value={form.getValues('address')} /><ReviewRow label={copy.documentsTitle} value={documents.map((item) => item.fileName).join(', ')} /><ReviewRow label={copy.amount} value="₹450 (mock)" /><Separator /><Field orientation="horizontal" className="rounded-xl border p-4"><Checkbox id="declaration-one" checked={declarationOne} onCheckedChange={(value) => setDeclarationOne(value === true)} /><FieldLabel htmlFor="declaration-one">{copy.declaration1}</FieldLabel></Field><Field orientation="horizontal" className="rounded-xl border p-4"><Checkbox id="declaration-two" checked={declarationTwo} onCheckedChange={(value) => setDeclarationTwo(value === true)} /><FieldLabel htmlFor="declaration-two">{copy.declaration2}</FieldLabel></Field></div>;
    return <MockPaymentGateway amountPaise={45000} applicationId={initial.application.id} locale={locale} value={paymentMethod} state={gatewayState} onValueChange={(value) => { setPaymentMethod(value); setGatewayState('idle'); setError(''); }} onPreviewFailure={() => { void recordRecovery('payment', 'Citizen previewed a failed mock payment; no charge made.'); setGatewayState('failure'); setError(locale === 'hi' ? 'मॉक भुगतान पूरा नहीं हुआ। कोई शुल्क नहीं लगा और आवेदन सुरक्षित है। तरीका चुनकर फिर प्रयास करें।' : 'The mock payment did not complete. Nothing was charged and the application is safe. Choose a method and try again.'); }} />;
  }
}

function ReviewRow({ label, value }: { label: string; value: string }) { return <div className="grid gap-1 border-b py-3 last:border-0 sm:grid-cols-[180px_1fr]"><dt className="text-sm font-medium text-muted-foreground">{label}</dt><dd className="break-words font-semibold">{value}</dd></div>; }
function stepTitle(step: number, copy: Copy) { return [copy.eligibilityTitle, copy.detailsTitle, copy.documentsTitle, copy.otpTitle, copy.reviewTitle, copy.paymentTitle][step]; }
function stepBody(step: number, copy: Copy) { return [copy.eligibilityBody, copy.detailsBody, copy.documentsBody, copy.otpBody, copy.reviewBody, copy.paymentBody][step]; }
function helperText(step: number, locale: Locale) { const en = ['Confirm that you understand the eligibility result is simulated.', 'Use only the synthetic contact details provided for the demo.', 'Select any harmless sample file; no bytes leave your browser.', 'The code is intentionally visible so judges can complete the flow.', 'Read both declarations before accepting them.', 'No financial details are needed. This creates a mock receipt.']; const hi = ['पुष्टि करें कि पात्रता परिणाम सिम्युलेटेड है।', 'डेमो के लिए केवल काल्पनिक संपर्क विवरण का उपयोग करें।', 'कोई भी सुरक्षित नमूना फ़ाइल चुनें; फ़ाइल अपलोड नहीं होगी।', 'जज प्रक्रिया पूरी कर सकें इसलिए कोड दिखाई देता है।', 'स्वीकार करने से पहले दोनों घोषणाएँ पढ़ें।', 'किसी वित्तीय विवरण की ज़रूरत नहीं। यह मॉक रसीद बनाता है।']; return (locale === 'hi' ? hi : en)[step]; }
