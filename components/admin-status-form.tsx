'use client';

import { useState } from 'react';
import { BellRing, CheckCircle2, LoaderCircle, MessageCircleMore, Send, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const defaults = { Submitted: 25, 'Documents checking': 45, 'Under review': 70, Approved: 100, 'Action required': 50 } as const;
type Status = keyof typeof defaults;

export function AdminStatusForm({ applicationId, initialStatus, initialProgress, readOnly = false }: { applicationId: string; initialStatus: string; initialProgress: number; readOnly?: boolean }) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>((initialStatus in defaults ? initialStatus : 'Submitted') as Status);
  const [progress, setProgress] = useState(initialProgress);
  const [message, setMessage] = useState('We have updated your synthetic application. Open Raahi to see what happens next.');
  const [queueWhatsapp, setQueueWhatsapp] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  async function submit() {
    setSaving(true); setSaved(false); setError('');
    const response = await fetch(`/api/admin/applications/${applicationId}/status`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status, progressPercent: progress, message, queueWhatsapp }) }).catch(() => null);
    if (!response?.ok) { setError('The status was not saved. Check the message and try again.'); setSaving(false); return; }
    setSaved(true); setSaving(false); router.refresh();
  }
  return <section aria-labelledby="status-editor-title" className="rounded-xl border bg-card"><div className="border-b p-5"><p className="text-xs font-semibold uppercase tracking-[.1em] text-muted-foreground">Status editor</p><h2 id="status-editor-title" className="mt-1 text-2xl">Update citizen progress</h2><p className="mt-1 text-sm text-muted-foreground">{readOnly ? 'This support role can inspect updates but cannot publish them.' : 'One save updates the timeline, notification centre, and mock delivery log.'}</p></div><div className="p-5"><FieldGroup><Field data-disabled={readOnly}><FieldLabel>Application status</FieldLabel><Select value={status} disabled={readOnly} onValueChange={(value) => { const next = value as Status; setStatus(next); setProgress(defaults[next]); }}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectGroup><SelectLabel>Citizen-facing stages</SelectLabel>{Object.keys(defaults).map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectGroup></SelectContent></Select></Field><Field data-disabled={readOnly}><div className="flex items-center justify-between gap-3"><FieldLabel htmlFor="progress">Timeline progress</FieldLabel><span className="text-sm font-semibold">{progress}%</span></div><Input id="progress" type="range" min={0} max={100} step={5} value={progress} disabled={readOnly} onChange={(event) => setProgress(Number(event.target.value))} className="h-10 cursor-pointer px-0" /><Progress value={progress} className="h-2" /><FieldDescription>Progress is descriptive and never presented as an official service estimate.</FieldDescription></Field><Field data-disabled={readOnly}><FieldLabel htmlFor="citizen-message">Citizen update</FieldLabel><Textarea id="citizen-message" value={message} disabled={readOnly} onChange={(event) => setMessage(event.target.value.slice(0, 240))} className="min-h-28" /><FieldDescription>{message.length}/240 · plain language, no personal data</FieldDescription></Field><Field data-disabled={readOnly} orientation="horizontal" className="rounded-xl border bg-secondary/45 p-4"><Checkbox id="mock-whatsapp" checked={queueWhatsapp} disabled={readOnly} onCheckedChange={(value) => setQueueWhatsapp(value === true)} /><FieldLabel htmlFor="mock-whatsapp">Queue a mock WhatsApp alert</FieldLabel></Field></FieldGroup><Alert className="mt-5 bg-secondary/55"><MessageCircleMore /><AlertTitle>Delivery preview</AlertTitle><AlertDescription><strong>{status}</strong> — {message}<br />{queueWhatsapp ? 'In-app notification + WhatsApp simulation will be recorded.' : 'In-app notification only.'}</AlertDescription></Alert>{error && <p role="alert" className="mt-4 text-sm font-medium text-destructive">{error}</p>}{saved && <p role="status" className="mt-4 flex items-center gap-2 text-sm font-medium text-success"><CheckCircle2 className="size-4" />Saved. The citizen notification is ready.</p>}<div className="mt-5 flex items-center justify-between gap-4 border-t pt-5"><span className="flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="size-4" />Simulation only</span><Button type="button" onClick={() => void submit()} disabled={readOnly || saving || message.trim().length < 12}>{saving ? <LoaderCircle className="animate-spin" data-icon="inline-start" /> : queueWhatsapp ? <BellRing data-icon="inline-start" /> : <Send data-icon="inline-start" />}{readOnly ? 'Read-only role' : saving ? 'Saving update…' : 'Publish update'}</Button></div></div></section>;
}
