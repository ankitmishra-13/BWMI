'use client';

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, FileCheck2, IndianRupee, LoaderCircle, LockKeyhole, ShieldCheck, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { AssistantSheet } from '@/components/assistant-sheet';
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
import { contactSchema, type ContactInput } from '@/lib/validation';

type DocumentMeta = { documentType: 'Address proof' | 'Medical certificate'; fileName: string; sizeBytes: number };

export function RenewalWizard({ initial, locale, copy }: { initial: ApplicationBundle; locale: Locale; copy: Copy }) {
  const router = useRouter();
  const [step, setStep] = useState(Math.min(initial.application.currentStep, 5));
  const [confirmed, setConfirmed] = useState(false);
  const [documents, setDocuments] = useState<DocumentMeta[]>(initial.documents.map((item) => ({ documentType: item.documentType as DocumentMeta['documentType'], fileName: item.fileName, sizeBytes: item.sizeBytes })));
  const [otp, setOtp] = useState('');
  const [declarationOne, setDeclarationOne] = useState(initial.application.declarationsAccepted);
  const [declarationTwo, setDeclarationTwo] = useState(initial.application.declarationsAccepted);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { email: initial.application.contactEmail, phone: initial.application.contactPhone, address: initial.application.address },
  });
  const draftKey = `renewal-draft:${initial.application.id}`;

  useEffect(() => {
    const raw = sessionStorage.getItem(draftKey);
    if (!raw) return;
    try {
      const draft = JSON.parse(raw) as Partial<ContactInput> & { step?: number; documents?: DocumentMeta[]; otp?: string; confirmed?: boolean; declarationOne?: boolean; declarationTwo?: boolean };
      if (draft.email) form.setValue('email', draft.email);
      if (draft.phone) form.setValue('phone', draft.phone);
      if (draft.address) form.setValue('address', draft.address);
      if (draft.documents) setDocuments(draft.documents);
      if (draft.otp) setOtp(draft.otp);
      if (typeof draft.confirmed === 'boolean') setConfirmed(draft.confirmed);
      if (typeof draft.declarationOne === 'boolean') setDeclarationOne(draft.declarationOne);
      if (typeof draft.declarationTwo === 'boolean') setDeclarationTwo(draft.declarationTwo);
      if (typeof draft.step === 'number') setStep(Math.max(0, Math.min(draft.step, initial.application.currentStep, 5)));
    } catch { sessionStorage.removeItem(draftKey); }
  }, [draftKey, form, initial.application.currentStep]);

  useEffect(() => {
    // React Hook Form intentionally exposes an imperative subscription for draft persistence.
    // eslint-disable-next-line react-hooks/incompatible-library
    const subscription = form.watch((values) => {
      sessionStorage.setItem(draftKey, JSON.stringify({ ...values, step, documents, otp, confirmed, declarationOne, declarationTwo }));
    });
    sessionStorage.setItem(draftKey, JSON.stringify({ ...form.getValues(), step, documents, otp, confirmed, declarationOne, declarationTwo }));
    return () => subscription.unsubscribe();
  }, [confirmed, declarationOne, declarationTwo, documents, draftKey, form, otp, step]);

  const labels = [copy.step0, copy.step1, copy.step2, copy.step3, copy.step4, copy.step5];
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
      payload = { step: 2, data: { documents } };
    } else if (step === 3) {
      if (otp !== '123456') return setError(copy.errorOtp);
      payload = { step: 3, data: { otp } };
    } else if (step === 4) {
      if (!declarationOne || !declarationTwo) return setError(copy.errorDeclarations);
      payload = { step: 4, data: { declarationsAccepted: true } };
    } else {
      payload = { step: 5, data: {} };
    }
    setSaving(true);
    try {
      const response = await fetch(`/api/applications/${initial.application.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error('save failed');
      if (step === 5) {
        sessionStorage.removeItem(draftKey);
        router.push(`/${locale}/status/${initial.application.id}`);
      } else {
        setStep((value) => Math.min(value + 1, 5));
        router.refresh();
      }
    } catch { setError(copy.errorGeneric); } finally { setSaving(false); }
  }

  function addDocument(file: File | undefined) {
    if (!file) return;
    if (file.size > 5_000_000) return setError(locale === 'hi' ? '5 MB से छोटी नमूना फ़ाइल चुनें।' : 'Choose a sample file smaller than 5 MB.');
    setDocuments((items) => [...items.filter((item) => item.documentType !== 'Address proof'), { documentType: 'Address proof', fileName: file.name, sizeBytes: file.size }]);
    setError('');
  }

  return (
    <div>
      <div className="mb-8 lg:hidden"><p className="text-sm font-semibold text-[#52667A]">{copy.stepOf.replace('{current}', String(step + 1)).replace('{total}', '6')}</p><Progress value={((step + 1) / 6) * 100} className="mt-3 h-2" /></div>
      <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_250px]">
        <aside className="hidden lg:block"><ol className="flex flex-col">
          {labels.map((label, index) => <li key={label} className="relative flex min-h-16 gap-3 pb-3"><span aria-hidden="true" className={`relative z-10 grid size-8 shrink-0 place-items-center rounded-full border-2 text-sm font-bold ${index < step ? 'border-[#0F766E] bg-[#0F766E] text-white' : index === step ? 'border-[#0F766E] bg-white text-[#0F766E]' : 'border-[#B8C5D3] bg-[#F6F8FB] text-[#52667A]'}`}>{index < step ? <Check className="size-4" /> : index + 1}</span>{index < labels.length - 1 && <span aria-hidden="true" className="absolute left-[15px] top-8 h-[calc(100%-10px)] w-0.5 bg-[#CBD5E1]" />}<span className={`pt-1 text-sm font-semibold ${index === step ? 'text-[#102A43]' : 'text-[#52667A]'}`}>{label}</span></li>)}
        </ol></aside>

        <section aria-labelledby="step-title" className="min-w-0 rounded-2xl border bg-white">
          <div className="border-b p-5 sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="eyebrow">{copy.stepOf.replace('{current}', String(step + 1)).replace('{total}', '6')}</p><h2 id="step-title" className="mt-2 text-2xl font-semibold sm:text-3xl">{stepTitle(step, copy)}</h2><p className="mt-2 max-w-2xl text-[#52667A]">{stepBody(step, copy)}</p></div><AssistantSheet applicationId={initial.application.id} step={step} locale={locale} copy={copy} /></div>
          </div>
          <div className="p-5 sm:p-7">{renderStep()}</div>
          {error && <p role="alert" className="mx-5 mb-2 rounded-xl border border-[#E7AEA8] bg-[#FFF2F0] p-4 text-sm font-medium text-[#B42318] sm:mx-7">{error}</p>}
          <div className="flex flex-col-reverse gap-3 border-t bg-[#FAFCFD] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <Button type="button" variant="ghost" disabled={step === 0 || saving} onClick={() => setStep((value) => Math.max(0, value - 1))} className="h-11 px-4"><ArrowLeft />{copy.back}</Button>
            <div className="flex items-center justify-end gap-4"><span aria-live="polite" className="hidden text-sm text-[#52667A] sm:inline">{saving ? copy.saving : copy.saved}</span><Button type="button" disabled={saving} onClick={saveAndContinue} className="h-12 bg-[#0F766E] px-5 text-base hover:bg-[#0B5F59]">{saving ? <LoaderCircle className="animate-spin" /> : step === 5 ? <IndianRupee /> : <ArrowRight />}{step === 5 ? copy.submitPayment : copy.continue}</Button></div>
          </div>
        </section>

        <aside className="hidden xl:block"><div className="sticky top-6 border-l pl-6"><p className="text-sm font-semibold text-[#102A43]">{copy.whatYouNeed}</p><p className="mt-2 text-sm leading-6 text-[#52667A]">{helperText(step, locale)}</p><div className="mt-5 flex items-start gap-2 text-xs text-[#52667A]"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#1F7A4C]" />{copy.prototype}</div></div></aside>
      </div>
    </div>
  );

  function renderStep() {
    if (step === 0) return <div className="flex flex-col gap-6"><Alert className="border-[#9AC9B0] bg-[#F1FAF5] text-[#1B5C3B]"><CheckCircle2 /><AlertTitle>{copy.eligible}</AlertTitle><AlertDescription>{copy.eligibilityBody}</AlertDescription></Alert><div><h3 className="text-lg font-semibold">{copy.requirementsTitle}</h3><ul className="mt-4 flex flex-col gap-3">{[copy.requirementA, copy.requirementB, copy.requirementC].map((item) => <li key={item} className="flex gap-3 text-[#40556A]"><Check className="mt-1 size-4 shrink-0 text-[#0F766E]" />{item}</li>)}</ul></div><Field orientation="horizontal" className="rounded-xl border bg-[#F8FAFC] p-4"><Checkbox id="eligibility-confirm" checked={confirmed} onCheckedChange={(value) => setConfirmed(value === true)} /><FieldLabel htmlFor="eligibility-confirm" className="font-medium">{copy.confirmEligibility}</FieldLabel></Field></div>;
    if (step === 1) return <FieldGroup><Field data-invalid={Boolean(form.formState.errors.email)}><FieldLabel htmlFor="email">{copy.email}</FieldLabel><Input id="email" type="email" autoComplete="email" {...form.register('email')} className="h-12 bg-white" /><FieldDescription>{copy.detailsBody}</FieldDescription><FieldError errors={[form.formState.errors.email]} /></Field><Field data-invalid={Boolean(form.formState.errors.phone)}><FieldLabel htmlFor="phone">{copy.phone}</FieldLabel><Input id="phone" type="tel" inputMode="tel" {...form.register('phone')} className="h-12 bg-white" /><FieldError errors={[form.formState.errors.phone]} /></Field><Field data-invalid={Boolean(form.formState.errors.address)}><FieldLabel htmlFor="address">{copy.fullAddress}</FieldLabel><Textarea id="address" {...form.register('address')} className="min-h-28 bg-white" /><FieldError errors={[form.formState.errors.address]} /></Field></FieldGroup>;
    if (step === 2) return <div className="flex flex-col gap-5"><Alert className="border-[#AFC0D0] bg-[#F7FAFC]"><Upload /><AlertTitle>{copy.documentsTitle}</AlertTitle><AlertDescription>{copy.documentsBody}</AlertDescription></Alert><Field><FieldLabel htmlFor="address-proof">{copy.addressProof}</FieldLabel><Input id="address-proof" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => addDocument(event.target.files?.[0])} className="h-auto min-h-12 cursor-pointer bg-white file:mr-3 file:rounded-md file:border-0 file:bg-[#E8F3F2] file:px-3 file:py-2 file:font-semibold file:text-[#0F766E]" /><FieldDescription>PDF, JPG or PNG · max 5 MB · metadata only</FieldDescription></Field>{documents.map((document) => <div key={document.documentType} className="flex items-center gap-4 rounded-xl border bg-[#F8FAFC] p-4"><FileCheck2 className="size-6 shrink-0 text-[#1F7A4C]" /><div className="min-w-0"><p className="truncate font-semibold">{document.fileName}</p><p className="text-sm text-[#52667A]">{(document.sizeBytes / 1024).toFixed(1)} KB · {copy.selectedFile}</p></div><Button type="button" variant="ghost" onClick={() => setDocuments([])} className="ml-auto h-11 text-[#B42318]">{copy.remove}</Button></div>)}</div>;
    if (step === 3) return <div className="max-w-md"><Alert className="border-[#E3C18D] bg-[#FFF9ED] text-[#5E4200]"><LockKeyhole /><AlertTitle>{copy.demoCode}</AlertTitle><AlertDescription>{copy.otpBody}</AlertDescription></Alert><Field className="mt-6"><FieldLabel htmlFor="otp">{copy.otp}</FieldLabel><Input id="otp" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" maxLength={6} className="h-14 text-center font-mono text-2xl tracking-[.35em]" /></Field></div>;
    if (step === 4) return <div className="flex flex-col gap-6"><ReviewRow label={copy.holder} value={initial.licence.holderName} /><ReviewRow label={copy.email} value={form.getValues('email')} /><ReviewRow label={copy.phone} value={form.getValues('phone')} /><ReviewRow label={copy.fullAddress} value={form.getValues('address')} /><ReviewRow label={copy.documentsTitle} value={documents.map((item) => item.fileName).join(', ')} /><ReviewRow label={copy.amount} value="₹450 (mock)" /><Separator /><Field orientation="horizontal" className="rounded-xl border p-4"><Checkbox id="declaration-one" checked={declarationOne} onCheckedChange={(value) => setDeclarationOne(value === true)} /><FieldLabel htmlFor="declaration-one">{copy.declaration1}</FieldLabel></Field><Field orientation="horizontal" className="rounded-xl border p-4"><Checkbox id="declaration-two" checked={declarationTwo} onCheckedChange={(value) => setDeclarationTwo(value === true)} /><FieldLabel htmlFor="declaration-two">{copy.declaration2}</FieldLabel></Field></div>;
    return <div className="flex flex-col gap-6"><Alert className="border-[#9AC9B0] bg-[#F1FAF5] text-[#1B5C3B]"><ShieldCheck /><AlertTitle>{copy.mockGateway}</AlertTitle><AlertDescription>{copy.paymentBody}</AlertDescription></Alert><dl className="border-y"><ReviewRow label={copy.amount} value="₹450.00" /><ReviewRow label={copy.paymentMethod} value={copy.mockGateway} /></dl><div><Button type="button" variant="outline" className="h-11 bg-white" onClick={() => setError(locale === 'hi' ? 'मॉक भुगतान पूरा नहीं हुआ। कोई शुल्क नहीं लगा। फिर कोशिश करने के लिए नीचे वाला बटन दबाएँ।' : 'The mock payment did not complete. Nothing was charged. Use the button below to try again.')}>{locale === 'hi' ? 'भुगतान विफलता का डेमो देखें' : 'Preview payment failure recovery'}</Button></div><p className="text-sm text-[#52667A]">{copy.prototype}</p></div>;
  }
}

function ReviewRow({ label, value }: { label: string; value: string }) { return <div className="grid gap-1 border-b py-3 last:border-0 sm:grid-cols-[180px_1fr]"><dt className="text-sm font-medium text-[#52667A]">{label}</dt><dd className="font-semibold break-words">{value}</dd></div>; }
function stepTitle(step: number, copy: Copy) { return [copy.eligibilityTitle, copy.detailsTitle, copy.documentsTitle, copy.otpTitle, copy.reviewTitle, copy.paymentTitle][step]; }
function stepBody(step: number, copy: Copy) { return [copy.eligibilityBody, copy.detailsBody, copy.documentsBody, copy.otpBody, copy.reviewBody, copy.paymentBody][step]; }
function helperText(step: number, locale: Locale) { const en = ['Confirm that you understand the eligibility result is simulated.', 'Use only the synthetic contact details provided for the demo.', 'Select any harmless sample file; no bytes leave your browser.', 'The code is intentionally visible so judges can complete the flow.', 'Read both declarations before accepting them.', 'No financial details are needed. This creates a mock receipt.']; const hi = ['पुष्टि करें कि पात्रता परिणाम सिम्युलेटेड है।', 'डेमो के लिए केवल काल्पनिक संपर्क विवरण का उपयोग करें।', 'कोई भी सुरक्षित नमूना फ़ाइल चुनें; फ़ाइल अपलोड नहीं होगी।', 'जज प्रक्रिया पूरी कर सकें इसलिए कोड दिखाई देता है।', 'स्वीकार करने से पहले दोनों घोषणाएँ पढ़ें।', 'किसी वित्तीय विवरण की ज़रूरत नहीं। यह मॉक रसीद बनाता है।']; return (locale === 'hi' ? hi : en)[step]; }
