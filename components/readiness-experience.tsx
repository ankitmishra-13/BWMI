'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, forwardRef, useEffect, useRef, useState } from 'react';
import { ArrowRight, Bot, Check, CheckCircle2, FileCheck2, Info, Mic, PencilLine, ShieldCheck, Sparkles, TriangleAlert } from 'lucide-react';
import { ReadAloudButton } from '@/components/read-aloud-button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { localPath, type Locale } from '@/lib/i18n';
import { readinessCopy } from '@/lib/readiness-copy';
import { evaluateReadiness, readinessSources, type ReadinessResult } from '@/lib/readiness';
import type { ReadinessCopilotOutput, ReadinessInput } from '@/lib/validation';

const storageKey = 'raahi-readiness-draft';
const defaults = (locale: Locale): ReadinessInput => ({ ageBand: '40-59', licenceType: 'private', expirySituation: 'within-year', issueState: 'Delhi', addressChanged: false, servicePreference: 'standard', preferredLocale: locale });

type RecognitionEvent = { results: { 0: { 0: { transcript: string } } } };
type Recognition = { lang: string; interimResults: boolean; continuous: boolean; start: () => void; stop: () => void; onresult: (event: RecognitionEvent) => void; onend: () => void; onerror: () => void };

export function ReadinessExperience({ locale, signedIn }: { locale: Locale; signedIn: boolean }) {
  const text = readinessCopy[locale];
  const router = useRouter();
  const resultRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<Recognition | null>(null);
  const [answers, setAnswers] = useState<ReadinessInput>(() => defaults(locale));
  const [message, setMessage] = useState('');
  const [interpretation, setInterpretation] = useState<ReadinessCopilotOutput | null>(null);
  const [fallback, setFallback] = useState(false);
  const [interpreting, setInterpreting] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState(false);
  const [result, setResult] = useState<ReadinessResult | null>(null);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = window.sessionStorage.getItem(storageKey);
        if (!stored) return;
        const parsed = JSON.parse(stored) as ReadinessInput;
        const restored = { ...defaults(locale), ...parsed, preferredLocale: locale };
        setAnswers(restored);
        setResult(evaluateReadiness(restored));
      } catch { /* Start from the safe example answers. */ }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [locale]);

  function update<K extends keyof ReadinessInput>(key: K, value: ReadinessInput[K]) {
    setAnswers((current) => ({ ...current, [key]: value }));
    setResult(null);
  }

  async function interpret() {
    if (!message.trim()) return;
    setInterpreting(true); setError('');
    try {
      const response = await fetch('/api/readiness/copilot', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ locale, message }) });
      const payload = await response.json() as ReadinessCopilotOutput & { error?: string; fallback?: boolean };
      if (!response.ok) throw new Error(payload.error || (locale === 'hi' ? 'कृपया केवल सामान्य स्थिति बताएँ।' : 'Please describe only the general situation.'));
      setInterpretation(payload);
      setFallback(Boolean(payload.fallback));
      const extracted = Object.fromEntries(Object.entries(payload.fields).filter(([, value]) => value !== undefined)) as Partial<ReadinessInput>;
      setAnswers((current) => ({ ...current, ...extracted, preferredLocale: locale }));
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not understand that request.'); }
    finally { setInterpreting(false); }
  }

  function startVoice() {
    setVoiceError(false);
    const RecognitionConstructor = (window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition }).SpeechRecognition
      ?? (window as unknown as { webkitSpeechRecognition?: new () => Recognition }).webkitSpeechRecognition;
    if (!RecognitionConstructor) { setVoiceError(true); return; }
    if (listening) { recognitionRef.current?.stop(); return; }
    const recognition = new RecognitionConstructor();
    recognition.lang = locale === 'hi' ? 'hi-IN' : 'en-IN'; recognition.interimResults = false; recognition.continuous = false;
    recognition.onresult = (event) => setMessage(event.results[0][0].transcript);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => { setListening(false); setVoiceError(true); };
    recognitionRef.current = recognition; setListening(true); recognition.start();
  }

  function showPlan(event: FormEvent) {
    event.preventDefault();
    const next = evaluateReadiness(answers);
    setResult(next);
    window.sessionStorage.setItem(storageKey, JSON.stringify(answers));
    window.setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30);
  }

  async function startRenewal() {
    window.sessionStorage.setItem(storageKey, JSON.stringify(answers));
    if (!signedIn) { const returnTo = `${localPath(locale, '/readiness')}?resume=1`; router.push(`${localPath(locale, '/login')}?returnTo=${encodeURIComponent(returnTo)}`); return; }
    setStarting(true); setError('');
    try {
      const response = await fetch('/api/applications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ locale, readiness: answers }) });
      const payload = await response.json() as { id?: string; error?: string };
      if (!response.ok || !payload.id) throw new Error(payload.error || 'Could not prepare the renewal.');
      window.sessionStorage.removeItem(storageKey);
      router.push(localPath(locale, `/renew/${payload.id}`));
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not prepare the renewal.'); setStarting(false); }
  }

  return (
    <div className="shell py-10 sm:py-16">
      <section className="grid items-end gap-8 border-b pb-10 lg:grid-cols-[minmax(0,.9fr)_minmax(420px,1.1fr)] lg:gap-16">
        <div className="reveal"><p className="eyebrow">{text.eyebrow}</p><h1 className="mt-4 max-w-3xl text-[clamp(3rem,8vw,6rem)] leading-[.94] tracking-[-.05em]">{text.title}</h1><p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">{text.body}</p><Alert className="mt-7 max-w-xl bg-white/75"><ShieldCheck /><AlertTitle>{text.mockNotice}</AlertTitle><AlertDescription>{locale === 'hi' ? 'कोई वास्तविक पहचान या वित्तीय जानकारी दर्ज न करें।' : 'Do not enter real identity or financial information.'}</AlertDescription></Alert></div>
        <div className="ios-panel reveal reveal-delay-1 p-5 sm:p-7"><div className="flex items-start gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-secondary"><Sparkles className="size-5" /></span><div><h2 className="text-2xl">{text.copilotTitle}</h2><p className="mt-1 text-sm text-muted-foreground">{text.copilotBody}</p></div></div><Field className="mt-6"><FieldLabel htmlFor="readiness-message">{locale === 'hi' ? 'अपनी स्थिति' : 'Your situation'}</FieldLabel><Textarea id="readiness-message" value={message} onChange={(event) => setMessage(event.target.value.slice(0, 300))} maxLength={300} placeholder={text.copilotPlaceholder} /><FieldDescription>{message.length}/300</FieldDescription></Field><div className="mt-4 flex flex-wrap gap-2"><Button type="button" onClick={() => void interpret()} disabled={!message.trim() || interpreting}><Bot />{interpreting ? (locale === 'hi' ? 'समझ रहे हैं…' : 'Understanding…') : text.interpret}</Button><Button type="button" variant="secondary" onClick={startVoice}><Mic />{listening ? text.stopVoice : text.startVoice}</Button><Button type="button" variant="ghost" onClick={() => setMessage(text.samplePrompt)}>{locale === 'hi' ? 'उदाहरण भरें' : 'Use example'}</Button></div>{voiceError && <p role="status" className="mt-3 text-sm text-warning">{text.voiceUnavailable}</p>}{interpretation && <Alert className="mt-5 bg-[#EDF5FC]"><Bot /><AlertTitle>{text.understood} <Badge variant="outline" className="ml-2">{fallback ? text.assistantFallback : text.assistantAi}</Badge></AlertTitle><AlertDescription><p>{interpretation.summary}</p><p>{interpretation.followUp}</p></AlertDescription></Alert>}</div>
      </section>

      <form onSubmit={showPlan} className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section className="ios-panel p-5 sm:p-8"><div className="flex items-center gap-3"><PencilLine className="size-5" /><h2 className="text-3xl">{text.assessmentTitle}</h2></div><p className="mt-3 text-sm text-muted-foreground">{text.editable}</p><FieldGroup className="mt-8">
          <FieldSet><FieldLegend>{text.age}</FieldLegend><ToggleGroup type="single" variant="outline" value={answers.ageBand} onValueChange={(value) => value && update('ageBand', value as ReadinessInput['ageBand'])} className="grid w-full grid-cols-1 sm:grid-cols-3"><ToggleGroupItem value="under-40" className="h-12 rounded-xl">{text.ageUnder40}</ToggleGroupItem><ToggleGroupItem value="40-59" className="h-12 rounded-xl">{text.age4059}</ToggleGroupItem><ToggleGroupItem value="60-plus" className="h-12 rounded-xl">{text.age60}</ToggleGroupItem></ToggleGroup></FieldSet>
          <FieldSet><FieldLegend>{text.licenceType}</FieldLegend><ToggleGroup type="single" variant="outline" value={answers.licenceType} onValueChange={(value) => value && update('licenceType', value as ReadinessInput['licenceType'])} className="grid w-full grid-cols-1 sm:grid-cols-2"><ToggleGroupItem value="private" className="h-12 rounded-xl">{text.private}</ToggleGroupItem><ToggleGroupItem value="transport" className="h-12 rounded-xl">{text.transport}</ToggleGroupItem></ToggleGroup></FieldSet>
          <Field><FieldLabel>{text.expiry}</FieldLabel><Select value={answers.expirySituation} onValueChange={(value) => update('expirySituation', value as ReadinessInput['expirySituation'])}><SelectTrigger className="h-12 w-full rounded-2xl bg-white px-4"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="more-than-year">{text.expiryFar}</SelectItem><SelectItem value="within-year">{text.expirySoon}</SelectItem><SelectItem value="expired-under-year">{text.expiredRecent}</SelectItem><SelectItem value="expired-over-year">{text.expiredLate}</SelectItem></SelectContent></Select></Field>
          <Field><FieldLabel>{text.state}</FieldLabel><Select value={answers.issueState} onValueChange={(value) => update('issueState', value as ReadinessInput['issueState'])}><SelectTrigger className="h-12 w-full rounded-2xl bg-white px-4"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Delhi">Delhi</SelectItem><SelectItem value="Maharashtra">Maharashtra</SelectItem><SelectItem value="Karnataka">Karnataka</SelectItem></SelectContent></Select></Field>
          <FieldSet><FieldLegend>{text.route}</FieldLegend><ToggleGroup type="single" variant="outline" value={answers.servicePreference} onValueChange={(value) => value && update('servicePreference', value as ReadinessInput['servicePreference'])} className="grid w-full grid-cols-1 sm:grid-cols-2"><ToggleGroupItem value="standard" className="h-12 rounded-xl">{text.standard}</ToggleGroupItem><ToggleGroupItem value="assisted" className="h-12 rounded-xl">{text.assisted}</ToggleGroupItem></ToggleGroup></FieldSet>
          <FieldLabel className="w-full rounded-2xl border bg-white p-4"><Checkbox checked={answers.addressChanged} onCheckedChange={(checked) => update('addressChanged', checked === true)} /><span>{text.addressChanged}</span></FieldLabel>
        </FieldGroup><Button type="submit" size="lg" className="mt-8 w-full sm:w-auto">{text.showPlan}<ArrowRight /></Button></section>
        <aside className="advanced-guidance lg:sticky lg:top-28 lg:self-start"><div className="ios-panel p-6"><Info className="size-5" /><h2 className="mt-4 text-xl">{locale === 'hi' ? 'निर्णय कैसे बनता है' : 'How the plan is decided'}</h2><ol className="mt-5 space-y-4 text-sm text-muted-foreground"><li><strong className="text-foreground">1. {locale === 'hi' ? 'आपकी बात समझना' : 'Understand'}</strong><br />{locale === 'hi' ? 'AI या अंतर्निहित भाषा नियम केवल उत्तर भरने में मदद करते हैं।' : 'AI or built-in language rules only help fill the answers.'}</li><li><strong className="text-foreground">2. {locale === 'hi' ? 'नियम लागू करना' : 'Apply rules'}</strong><br />{locale === 'hi' ? 'छोटा, निश्चित नियम सेट चेकलिस्ट बनाता है।' : 'A small deterministic rule set creates the checklist.'}</li><li><strong className="text-foreground">3. {locale === 'hi' ? 'आप पुष्टि करते हैं' : 'You confirm'}</strong><br />{locale === 'hi' ? 'आवेदन शुरू होने से पहले हर बात दिखाई जाती है।' : 'Everything is shown before an application starts.'}</li></ol></div></aside>
      </form>

      {error && <Alert variant="destructive" className="mt-8"><TriangleAlert /><AlertTitle>{locale === 'hi' ? 'आगे नहीं बढ़ सके' : 'Could not continue'}</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
      {result && <ReadinessPlan ref={resultRef} locale={locale} result={result} onStart={() => void startRenewal()} onChange={() => { setResult(null); window.scrollTo({ top: 620, behavior: 'smooth' }); }} starting={starting} signedIn={signedIn} />}
      <Comparison locale={locale} />
    </div>
  );
}

const ReadinessPlan = forwardRef<HTMLDivElement, { locale: Locale; result: ReadinessResult; onStart: () => void; onChange: () => void; starting: boolean; signedIn: boolean }>(function ReadinessPlan({ locale, result, onStart, onChange, starting, signedIn }, ref) {
  const text = readinessCopy[locale];
  const speech = [result.status === 'ready' ? text.readyTitle : text.attentionTitle, ...result.readyItems.map((value) => value.title[locale]), ...result.documents.map((value) => value.title[locale]), ...result.blockers.map((value) => value.title[locale])].join('. ');
  return <section ref={ref} className="scroll-mt-28 border-b pt-14 pb-14" aria-live="polite"><div className="route-texture overflow-hidden rounded-[2rem] p-5 text-white sm:p-8 lg:p-10"><div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between"><div className="max-w-3xl"><p className="eyebrow !text-white/65">{text.resultEyebrow}</p><h2 className="mt-3 text-[clamp(2.4rem,6vw,4.5rem)] leading-[1]">{result.status === 'ready' ? text.readyTitle : text.attentionTitle}</h2><p className="mt-4 text-white/70">{text.resultBody}</p></div><ReadAloudButton locale={locale} text={speech} /></div><div className="mt-8 grid gap-4 sm:grid-cols-3"><Metric label={text.medical} value={result.medicalRequired ? text.required : text.notRequired} /><Metric label={text.expected} value={`${result.estimatedMinutes} ${text.minutes}`} /><Metric label={text.fee} value={`₹${(result.feePaise / 100).toFixed(0)}`} /></div></div>
    <div className="mt-6 grid gap-5 lg:grid-cols-3"><PlanList icon={CheckCircle2} title={text.readyNow} items={result.readyItems} locale={locale} tone="success" /><PlanList icon={FileCheck2} title={text.documents} items={result.documents} locale={locale} /><PlanList icon={TriangleAlert} title={text.blockers} items={result.blockers} locale={locale} empty={text.noBlockers} tone="warning" /></div>
    <div className="mt-7 flex flex-col gap-4 rounded-[1.75rem] border bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"><div><p className="font-semibold">{signedIn ? text.start : text.signIn}</p><p className="mt-1 text-sm text-muted-foreground">{signedIn ? (locale === 'hi' ? 'चेकलिस्ट आपके ड्राफ्ट के साथ जुड़ जाएगी।' : 'This checklist will be attached to your draft.') : text.savedLocal}</p></div><div className="flex flex-col gap-2 sm:flex-row"><Button type="button" variant="ghost" onClick={onChange}>{text.change}</Button><Button type="button" size="lg" onClick={onStart} disabled={starting}>{starting ? (locale === 'hi' ? 'तैयार हो रहा है…' : 'Preparing…') : (signedIn ? text.start : text.signIn)}<ArrowRight /></Button></div></div>
    <details className="advanced-guidance mt-5 rounded-2xl border bg-white p-5"><summary className="cursor-pointer font-semibold">{text.sources}</summary><p className="mt-3 text-sm text-muted-foreground">{text.sourceBody}</p><ul className="mt-3 space-y-2 text-sm">{readinessSources.map((source) => <li key={source.href}><a className="underline underline-offset-4" href={source.href} target="_blank" rel="noreferrer">{source.label[locale]}</a></li>)}</ul></details>
  </section>;
});

function Metric({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl border border-white/15 bg-white/8 p-4"><p className="text-xs uppercase tracking-[.12em] text-white/55">{label}</p><p className="mt-2 font-semibold">{value}</p></div>; }
function PlanList({ icon: Icon, title, items, locale, empty, tone }: { icon: typeof Check; title: string; items: ReadinessResult['documents']; locale: Locale; empty?: string; tone?: 'success' | 'warning' }) { return <section className="ios-panel p-5"><div className="flex items-center gap-3"><span className={`grid size-10 place-items-center rounded-full ${tone === 'success' ? 'bg-[#EAF7EF] text-success' : tone === 'warning' ? 'bg-[#FFF5E4] text-warning' : 'bg-secondary'}`}><Icon className="size-5" /></span><h3 className="text-xl">{title}</h3></div>{items.length ? <ul className="mt-5 divide-y">{items.map((value) => <li key={value.id} className="py-4 first:pt-0 last:pb-0"><p className="font-medium">{value.title[locale]}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{value.reason[locale]}</p></li>)}</ul> : <p className="mt-5 text-sm text-muted-foreground">{empty}</p>}</section>; }
function Comparison({ locale }: { locale: Locale }) { const text = readinessCopy[locale]; return <section className="advanced-guidance py-14"><p className="eyebrow">{text.compareTitle}</p><div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><h2 className="max-w-2xl text-4xl sm:text-5xl">{text.compareTitle}</h2><p className="max-w-md text-sm text-muted-foreground">{text.compareBody}</p></div><div className="mt-7 overflow-x-auto rounded-[1.75rem] border bg-white"><table className="w-full min-w-[680px] border-collapse text-left"><thead><tr className="bg-secondary/70"><th className="p-4 text-sm">{text.dimension}</th><th className="p-4 text-sm">{text.current}</th><th className="p-4 text-sm">{text.raahi}</th></tr></thead><tbody>{text.comparison.map((row) => <tr key={row[0]} className="border-t"><th className="p-4 text-sm font-medium">{row[0]}</th><td className="p-4 text-sm text-muted-foreground">{row[1]}</td><td className="p-4 text-sm font-semibold text-success"><span className="inline-flex items-center gap-2"><Check className="size-4" />{row[2]}</span></td></tr>)}</tbody></table></div></section>; }
