'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowRight, CheckCircle2, CircleAlert, FileUp, LoaderCircle, ShieldCheck, UserRoundCheck } from 'lucide-react';
import { ReadAloudButton } from '@/components/read-aloud-button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type { Locale } from '@/lib/i18n';

const copy = {
  en: { eyebrow: 'Next action centre', clearTitle: 'Nothing is needed from you right now.', clearBody: 'The synthetic review team is checking the document metadata. Your receipt and application remain safe.', actionTitle: 'One sample correction is needed.', actionBody: 'Choose a harmless sample file. Raahi stores only its name and size—no file bytes leave your browser.', happened: 'What happened', who: 'Who acts next', you: 'What you do', timing: 'Expected timing', clearHappened: 'Application and mock payment were recorded.', clearWho: 'Synthetic document review team', clearYou: 'Wait—Raahi will explain if anything changes.', clearTiming: 'Next demo update within 2 working days', actionHappened: 'The sample address-proof filename was unclear.', actionWho: 'You, then the synthetic review team', actionYou: 'Choose a clearer sample filename below.', actionTiming: 'Review resumes immediately after correction', label: 'Replacement sample file', helper: 'PDF, JPG or PNG · max 5 MB · metadata only', submit: 'Send sample correction', preview: 'Preview an action-required case', previewBody: 'For judges: safely changes this synthetic application to “Action required” so the recovery flow can be demonstrated.', error: 'The demonstration could not be updated. Please try again.' },
  hi: { eyebrow: 'अगला कदम केंद्र', clearTitle: 'अभी आपको कुछ करने की ज़रूरत नहीं है।', clearBody: 'काल्पनिक समीक्षा टीम दस्तावेज़ मेटाडेटा जाँच रही है। आपकी रसीद और आवेदन सुरक्षित हैं।', actionTitle: 'एक नमूना सुधार आवश्यक है।', actionBody: 'कोई सुरक्षित नमूना फ़ाइल चुनें। Raahi केवल उसका नाम और आकार रखता है—फ़ाइल ब्राउज़र से बाहर नहीं जाती।', happened: 'क्या हुआ', who: 'अब कौन करेगा', you: 'आपको क्या करना है', timing: 'अनुमानित समय', clearHappened: 'आवेदन और मॉक भुगतान दर्ज हो गए।', clearWho: 'काल्पनिक दस्तावेज़ समीक्षा टीम', clearYou: 'प्रतीक्षा करें—बदलाव होने पर Raahi समझाएगा।', clearTiming: 'अगला डेमो अपडेट 2 कार्य दिवस में', actionHappened: 'नमूना पते के प्रमाण का फ़ाइल नाम स्पष्ट नहीं था।', actionWho: 'पहले आप, फिर काल्पनिक समीक्षा टीम', actionYou: 'नीचे अधिक स्पष्ट नमूना फ़ाइल नाम चुनें।', actionTiming: 'सुधार के तुरंत बाद समीक्षा फिर शुरू', label: 'बदली हुई नमूना फ़ाइल', helper: 'PDF, JPG या PNG · अधिकतम 5 MB · केवल मेटाडेटा', submit: 'नमूना सुधार भेजें', preview: 'कार्रवाई-आवश्यक स्थिति का उदाहरण', previewBody: 'जजों के लिए: इस काल्पनिक आवेदन को सुरक्षित रूप से “कार्रवाई आवश्यक” बनाता है, ताकि सुधार प्रक्रिया दिखाई जा सके।', error: 'डेमो अपडेट नहीं हो सका। फिर प्रयास करें।' },
} as const;

export function NextActionCentre({ applicationId, status, locale }: { applicationId: string; status: string; locale: Locale }) {
  const router = useRouter();
  const text = copy[locale];
  const [currentStatus, setCurrentStatus] = useState(status);
  const actionRequired = currentStatus === 'Action required';
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const rows = actionRequired
    ? [[text.happened, text.actionHappened], [text.who, text.actionWho], [text.you, text.actionYou], [text.timing, text.actionTiming]]
    : [[text.happened, text.clearHappened], [text.who, text.clearWho], [text.you, text.clearYou], [text.timing, text.clearTiming]];
  const spoken = [actionRequired ? text.actionTitle : text.clearTitle, ...rows.map(([label, value]) => `${label}: ${value}`)].join('. ');

  async function update(action: 'simulate' | 'resolve') {
    if (action === 'resolve' && !file) return;
    setSaving(true); setError('');
    try {
      const response = await fetch(`/api/applications/${applicationId}/next-action`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(action === 'simulate' ? { action } : { action, fileName: file!.name }) });
      if (!response.ok) throw new Error('update failed');
      const result = await response.json() as { status: string };
      setCurrentStatus(result.status);
      setFile(null);
      setSaving(false);
      router.refresh();
    } catch { setError(text.error); setSaving(false); }
  }

  return <section aria-labelledby="next-action-title" className="mt-10 overflow-hidden rounded-[2rem] border bg-white shadow-[0_20px_55px_rgba(10,10,10,.06)]">
    <div className={`p-6 sm:p-8 ${actionRequired ? 'bg-[#FFF7E8]' : 'bg-[#EEF8F3]'}`}><div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"><div className="flex items-start gap-4"><span className={`grid size-12 shrink-0 place-items-center rounded-full bg-white ${actionRequired ? 'text-warning' : 'text-success'}`}>{actionRequired ? <CircleAlert /> : <CheckCircle2 />}</span><div><p className="eyebrow">{text.eyebrow}</p><h2 id="next-action-title" className="mt-2 text-2xl sm:text-3xl">{actionRequired ? text.actionTitle : text.clearTitle}</h2><p className="mt-2 max-w-2xl text-sm text-muted-foreground">{actionRequired ? text.actionBody : text.clearBody}</p></div></div><ReadAloudButton locale={locale} text={spoken} /></div></div>
    <dl className="grid sm:grid-cols-2">{rows.map(([label, value], index) => <div key={label} className={`p-5 sm:p-6 ${index < 2 ? 'border-b' : ''} ${index % 2 === 0 ? 'sm:border-r' : ''}`}><dt className="text-xs font-semibold uppercase tracking-[.12em] text-muted-foreground">{label}</dt><dd className="mt-2 font-medium">{value}</dd></div>)}</dl>
    {actionRequired ? <div className="border-t bg-secondary/35 p-5 sm:p-6"><Field><FieldLabel htmlFor="sample-correction">{text.label}</FieldLabel><Input id="sample-correction" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => { const next = event.target.files?.[0] ?? null; setFile(next && next.size <= 5_000_000 ? next : null); }} className="h-auto min-h-12 cursor-pointer bg-white file:mr-3 file:rounded-full file:border-0 file:bg-secondary file:px-3 file:py-2 file:font-semibold" /><FieldDescription>{text.helper}</FieldDescription></Field><Button type="button" className="mt-5 w-full sm:w-auto" disabled={!file || saving} onClick={() => void update('resolve')}>{saving ? <LoaderCircle className="animate-spin" /> : <FileUp />}{text.submit}<ArrowRight /></Button></div> : <div className="advanced-guidance border-t p-5 sm:p-6"><Alert className="bg-secondary/55"><ShieldCheck /><AlertTitle>{text.preview}</AlertTitle><AlertDescription>{text.previewBody}</AlertDescription></Alert><Button type="button" variant="ghost" size="sm" className="mt-3" disabled={saving} onClick={() => void update('simulate')}>{saving ? <LoaderCircle className="animate-spin" /> : <UserRoundCheck />}{text.preview}</Button></div>}
    {error && <p role="alert" className="border-t px-6 py-4 text-sm font-medium text-destructive">{error}</p>}
  </section>;
}
