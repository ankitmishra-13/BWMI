'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, FileCheck2, KeyRound, Link2, LockKeyhole, ShieldCheck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import type { Locale } from '@/lib/i18n';

const documents = ['Synthetic driving licence summary', 'Sample address metadata', 'Date-of-birth confirmation'];

export function RegisterFunnel({ locale, returnTo, compact = false }: { locale: Locale; returnTo: string; compact?: boolean }) {
  const hi = locale === 'hi';
  const [step, setStep] = useState(0);
  const [fullName, setFullName] = useState('Meena Sharma');
  const [email, setEmail] = useState('meena.demo@bwmi.test');
  const [phone, setPhone] = useState('+91 91234 56789');
  const [otp, setOtp] = useState('');
  const [consent, setConsent] = useState(false);
  const [linked, setLinked] = useState(false);
  const [selected, setSelected] = useState(documents);
  const [error, setError] = useState('');
  const labels = hi ? ['विवरण', 'सत्यापन', 'DigiLocker', 'समीक्षा'] : ['Details', 'Verify', 'DigiLocker', 'Review'];

  function next() {
    setError('');
    if (step === 0 && (!fullName.trim() || !email.toLowerCase().endsWith('@bwmi.test') || !/^\+91 [6-9]\d{4} \d{5}$/.test(phone))) {
      return setError(hi ? 'दिखाए गए काल्पनिक प्रारूप में सभी विवरण भरें।' : 'Complete every field using the displayed fictional formats.');
    }
    if (step === 1 && otp !== '123456') return setError(hi ? 'दिखाई गई डेमो OTP 123456 दर्ज करें।' : 'Enter the visible demo OTP 123456.');
    if (step === 2 && (!consent || !linked || selected.length === 0)) return setError(hi ? 'सहमति दें, मॉक DigiLocker जोड़ें और कम से कम एक रिकॉर्ड चुनें।' : 'Give consent, connect the mock DigiLocker, and select at least one record.');
    setStep((value) => Math.min(3, value + 1));
  }

  return <form action="/api/demo-auth/register" method="post" className="flex flex-col gap-5">
    <input type="hidden" name="returnTo" value={returnTo} />
    <input type="hidden" name="locale" value={locale} />
    <input type="hidden" name="fullName" value={fullName} />
    <input type="hidden" name="email" value={email} />
    <input type="hidden" name="syntheticPhone" value={phone} />
    <input type="hidden" name="otp" value={otp} />
    <input type="hidden" name="digilockerConsent" value={consent && linked ? 'yes' : 'no'} />

    <div><div className="flex items-center justify-between gap-4 text-xs font-semibold text-muted-foreground"><span>{hi ? `चरण ${step + 1}, कुल 4` : `Step ${step + 1} of 4`}</span><span>{labels[step]}</span></div><Progress value={(step + 1) * 25} className="mt-2 h-1.5" /></div>

    {step === 0 && <FieldGroup><Field><FieldLabel htmlFor={`register-name-${compact}`}>{hi ? 'काल्पनिक पूरा नाम' : 'Fictional full name'}</FieldLabel><Input id={`register-name-${compact}`} value={fullName} onChange={(event) => setFullName(event.target.value)} autoComplete="name" /><FieldDescription>{hi ? 'डेमो के लिए कोई काल्पनिक नाम उपयोग करें।' : 'Use any fictional name for this demo.'}</FieldDescription></Field><Field><FieldLabel htmlFor={`register-email-${compact}`}>{hi ? 'काल्पनिक ईमेल' : 'Fictional email'}</FieldLabel><Input id={`register-email-${compact}`} type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" /><FieldDescription>{hi ? 'केवल @bwmi.test पता स्वीकार होगा।' : 'Only an @bwmi.test address is accepted.'}</FieldDescription></Field><Field><FieldLabel htmlFor={`register-phone-${compact}`}>{hi ? 'काल्पनिक मोबाइल नंबर' : 'Fictional mobile number'}</FieldLabel><Input id={`register-phone-${compact}`} value={phone} onChange={(event) => setPhone(event.target.value)} inputMode="tel" /><FieldDescription>Format: +91 91234 56789 · {hi ? 'कोई संदेश नहीं भेजा जाएगा' : 'no message will be sent'}</FieldDescription></Field></FieldGroup>}

    {step === 1 && <div className="flex flex-col gap-5"><Alert className="bg-secondary/70"><KeyRound /><AlertTitle>{hi ? 'दिखाई गई डेमो OTP' : 'Visible demo OTP'}</AlertTitle><AlertDescription>123456 · {hi ? 'यह वास्तविक पहचान सत्यापन नहीं है।' : 'This is not real identity verification.'}</AlertDescription></Alert><Field><FieldLabel htmlFor={`register-otp-${compact}`}>{hi ? 'छह अंकों की OTP' : 'Six-digit OTP'}</FieldLabel><Input id={`register-otp-${compact}`} value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" className="h-14 text-center font-mono text-2xl tracking-[.3em]" maxLength={6} /></Field></div>}

    {step === 2 && <div className="flex flex-col gap-5"><Alert className="bg-[#F4EBDD]"><LockKeyhole /><AlertTitle>{hi ? 'सुरक्षित मॉक DigiLocker लिंक' : 'Secure mock DigiLocker link'}</AlertTitle><AlertDescription>{hi ? 'कोई सरकारी सेवा नहीं खुलती। केवल नीचे दिखाया काल्पनिक मेटाडेटा चुना जाता है।' : 'No government service opens. Only the fictional metadata shown below is selected.'}</AlertDescription></Alert><Field orientation="horizontal" className="rounded-2xl border bg-background p-4"><Checkbox id={`digilocker-consent-${compact}`} checked={consent} onCheckedChange={(value) => setConsent(value === true)} /><FieldLabel htmlFor={`digilocker-consent-${compact}`}>{hi ? 'मैं इस सिमुलेशन में चुने हुए रिकॉर्ड साझा करने की सहमति देता/देती हूँ।' : 'I consent to share the selected records in this simulation.'}</FieldLabel></Field><div className="rounded-2xl border bg-background p-4"><p className="font-semibold">{hi ? 'लाने के लिए रिकॉर्ड चुनें' : 'Choose records to fetch'}</p><div className="mt-3 flex flex-col gap-3">{documents.map((document, index) => { const fieldId = `digilocker-record-${compact}-${index}`; return <Field key={document} orientation="horizontal"><Checkbox id={fieldId} checked={selected.includes(document)} onCheckedChange={(value) => setSelected((items) => value === true ? [...new Set([...items, document])] : items.filter((item) => item !== document))} /><FieldLabel htmlFor={fieldId}>{document}</FieldLabel></Field>; })}</div></div><Button type="button" variant={linked ? 'secondary' : 'outline'} disabled={!consent} onClick={() => setLinked(true)}>{linked ? <Check data-icon="inline-start" /> : <Link2 data-icon="inline-start" />}{linked ? (hi ? 'मॉक DigiLocker जुड़ा' : 'Mock DigiLocker connected') : (hi ? 'मॉक DigiLocker जोड़ें' : 'Connect mock DigiLocker')}</Button></div>}

    {step === 3 && <div className="flex flex-col gap-4"><Alert className="bg-[#EDF6EF]"><ShieldCheck /><AlertTitle>{hi ? 'खाता खोलने के लिए तैयार' : 'Ready to open your account'}</AlertTitle><AlertDescription>{hi ? 'सभी विवरण काल्पनिक हैं और DigiLocker कनेक्शन सिम्युलेटेड है।' : 'All details are fictional and the DigiLocker connection is simulated.'}</AlertDescription></Alert><dl className="divide-y rounded-2xl border bg-background px-4"><Review label={hi ? 'नाम' : 'Name'} value={fullName} /><Review label={hi ? 'ईमेल' : 'Email'} value={email} /><Review label={hi ? 'मोबाइल' : 'Mobile'} value={phone} /><Review label="DigiLocker" value={`${selected.length} ${hi ? 'काल्पनिक रिकॉर्ड चुने' : 'fictional records selected'}`} /></dl></div>}

    {error && <p role="alert" className="rounded-xl border border-destructive/25 bg-[#FFF1EE] p-3 text-sm font-medium text-destructive">{error}</p>}
    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">{step > 0 ? <Button type="button" variant="ghost" onClick={() => { setStep((value) => value - 1); setError(''); }}><ArrowLeft data-icon="inline-start" />{hi ? 'पीछे' : 'Back'}</Button> : <span />}{step < 3 ? <Button type="button" onClick={next}>{hi ? 'जारी रखें' : 'Continue'}<ArrowRight data-icon="inline-end" /></Button> : <Button type="submit"><FileCheck2 data-icon="inline-start" />{hi ? 'काल्पनिक खाता बनाएँ' : 'Create synthetic account'}</Button>}</div>
  </form>;
}

function Review({ label, value }: { label: string; value: string }) { return <div className="grid gap-1 py-3 sm:grid-cols-[120px_1fr]"><dt className="text-muted-foreground">{label}</dt><dd className="break-words font-semibold">{value}</dd></div>; }
