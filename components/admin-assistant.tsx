'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Bot, FileSearch, LoaderCircle, Send, ShieldCheck, Sparkles } from 'lucide-react';
import type { AdminSession } from '@/app/admin-auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';

type AssistantAnswer = { answer: string; evidence: string[]; suggestions: string[]; fallback: boolean };

export function AdminAssistant({ admin, applicationId, triggerOnly = false }: { admin: AdminSession; applicationId?: string; triggerOnly?: boolean }) {
  const pathname = usePathname();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<AssistantAnswer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const prompts = applicationId
    ? ['Summarise this application', 'What needs attention?', 'Draft a plain-language citizen update']
    : ['Which queue needs attention?', 'Summarise regional workload', 'What should I review first?'];

  async function ask(nextQuestion = question) {
    if (nextQuestion.trim().length < 3) return;
    setQuestion(nextQuestion);
    setLoading(true);
    setError('');
    setAnswer(null);
    const response = await fetch('/api/admin/assistant', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: nextQuestion, applicationId, stateCode: admin.regionCode, contextType: applicationId ? 'application' : pathname }),
    }).catch(() => null);
    const data = response ? await response.json().catch(() => null) as AssistantAnswer & { error?: string } : null;
    if (!response?.ok || !data) setError(data?.error ?? 'The assistant could not respond. Try a suggested question.');
    else setAnswer(data);
    setLoading(false);
  }

  const hasConversation = loading || Boolean(answer) || Boolean(error);
  const body = <div className="flex min-h-0 flex-1 flex-col">
    <ScrollArea className="min-h-0 flex-1">
      <div className="flex min-h-full flex-col gap-4 p-5 sm:p-6">
        {!hasConversation && <>
          <Alert className="bg-secondary/55"><ShieldCheck /><AlertTitle>Permission-scoped assistance</AlertTitle><AlertDescription>The Copilot sees only redacted synthetic records available to {admin.name}. It cannot publish or approve changes.</AlertDescription></Alert>
          <Card size="sm"><CardHeader><span className="mb-3 grid size-10 place-items-center rounded-lg bg-secondary"><Sparkles className="size-5" /></span><CardTitle>Start with an operational question</CardTitle><CardDescription>Ask about this permitted queue, region, or application. Recommendations remain review-only.</CardDescription></CardHeader></Card>
        </>}
        {hasConversation && <p className="ml-auto max-w-[88%] rounded-xl bg-primary px-4 py-3 text-sm text-primary-foreground">{question}</p>}
        {loading && <Card size="sm"><CardHeader><CardTitle className="flex items-center gap-2"><LoaderCircle className="size-4 animate-spin" />Raahi Ops Copilot</CardTitle><CardDescription className="shimmer">Reviewing the permitted synthetic context…</CardDescription></CardHeader></Card>}
        {answer && <Card><CardHeader><div className="flex flex-wrap items-center gap-2"><Bot className="size-5" /><CardTitle>Raahi Ops Copilot</CardTitle><Badge variant="outline">{answer.fallback ? 'Built-in analysis' : 'AI-assisted'}</Badge></div><CardDescription>Permission-scoped and review-only</CardDescription></CardHeader><CardContent><p className="whitespace-pre-line text-sm leading-6 text-foreground">{answer.answer}</p><div className="mt-4 border-t pt-3"><p className="text-xs font-semibold uppercase tracking-[.08em] text-muted-foreground">Evidence used</p><ul className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground">{answer.evidence.map((item) => <li key={item} className="flex gap-2"><FileSearch className="mt-0.5 size-3.5 shrink-0" />{item}</li>)}</ul></div></CardContent></Card>}
        {error && <Alert variant="destructive"><AlertTitle>Copilot unavailable</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
      </div>
    </ScrollArea>
    <div className="shrink-0 border-t bg-card p-4 sm:p-5">
      <div aria-label="Suggested questions" className="flex gap-2 overflow-x-auto pb-3">{(answer?.suggestions ?? prompts).map((prompt) => <Button key={prompt} type="button" variant="secondary" size="sm" className="shrink-0" onClick={() => void ask(prompt)}>{prompt}</Button>)}</div>
      <Field><FieldLabel htmlFor={`admin-copilot-${triggerOnly}`}>Ask Raahi Ops Copilot</FieldLabel><Textarea id={`admin-copilot-${triggerOnly}`} value={question} onChange={(event) => setQuestion(event.target.value.slice(0, 300))} maxLength={300} placeholder="Ask about workload, an application, or a citizen update…" className="min-h-16 resize-none sm:min-h-20" /><FieldDescription>{question.length}/300 · Do not enter real personal data.</FieldDescription></Field>
      <Button type="button" className="mt-3 w-full" onClick={() => void ask()} disabled={loading || question.trim().length < 3}>{loading ? <LoaderCircle className="animate-spin" data-icon="inline-start" /> : <Send data-icon="inline-start" />}{loading ? 'Reviewing permitted context…' : 'Ask Copilot'}</Button>
    </div>
  </div>;

  if (!triggerOnly) return <section className="flex h-[calc(100svh-4rem)] min-h-[640px] flex-col bg-background"><header className="border-b bg-card px-5 py-5 sm:px-7"><p className="text-xs font-semibold uppercase tracking-[.1em] text-muted-foreground">Raahi intelligence</p><h1 className="mt-1 text-2xl font-semibold">Operations Copilot</h1><p className="mt-1 text-sm text-muted-foreground">Review queues and draft clearer next steps with permission-scoped synthetic context.</p></header>{body}</section>;

  return <Sheet><SheetTrigger asChild><Button type="button" size="sm" aria-label="Ask Copilot"><Bot data-icon="inline-start" /><span className="hidden sm:inline">Ask Copilot</span></Button></SheetTrigger><SheetContent className="flex w-full flex-col p-0 sm:max-w-xl"><SheetHeader className="border-b px-5 py-5 pr-14 sm:px-6"><SheetTitle className="text-xl">Raahi Ops Copilot</SheetTitle><SheetDescription>Read-only assistance for the current admin context.</SheetDescription></SheetHeader>{body}</SheetContent></Sheet>;
}
