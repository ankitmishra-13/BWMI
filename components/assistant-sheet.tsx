'use client';

import { FormEvent, useState } from 'react';
import { Bot, LoaderCircle, Send, ShieldAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import type { Copy, Locale } from '@/lib/i18n';

export function AssistantSheet({ applicationId, step, locale, copy }: { applicationId: string; step: number; locale: Locale; copy: Copy }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [fallback, setFallback] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function ask(event: FormEvent) {
    event.preventDefault();
    if (question.trim().length < 3) return;
    setLoading(true); setError(''); setAnswer('');
    try {
      const response = await fetch('/api/assistant', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, step, locale, question: question.trim() }),
      });
      const data = await response.json() as { answer?: string; suggestions?: string[]; fallback?: boolean; error?: string };
      if (!response.ok || !data.answer) throw new Error(data.error || copy.errorGeneric);
      setAnswer(data.answer); setSuggestions(data.suggestions ?? []); setFallback(Boolean(data.fallback));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : copy.errorGeneric);
    } finally { setLoading(false); }
  }

  return (
    <Sheet>
      <SheetTrigger asChild><Button type="button" variant="outline"><Bot data-icon="inline-start" />{copy.explain}</Button></SheetTrigger>
      <SheetContent className="w-[min(92vw,440px)] overflow-y-auto sm:max-w-md">
        <SheetHeader className="border-b p-6 pr-14"><SheetTitle className="text-2xl font-semibold">{copy.assistantTitle}</SheetTitle><SheetDescription>{copy.assistantLimits}</SheetDescription></SheetHeader>
        <div className="flex flex-col gap-5 p-6">
          <Alert className="bg-[#FFF9ED] text-[#5E4200]"><ShieldAlert /><AlertTitle>{copy.prototype}</AlertTitle><AlertDescription>{copy.assistantPrivacy}</AlertDescription></Alert>
          <form onSubmit={ask} className="flex flex-col gap-4">
            <Field><FieldLabel htmlFor="assistant-question">{copy.assistantQuestion}</FieldLabel><Textarea id="assistant-question" value={question} onChange={(event) => setQuestion(event.target.value)} maxLength={300} placeholder={copy.assistantPlaceholder} className="min-h-28 resize-y bg-white" /><FieldDescription>{question.length}/300</FieldDescription></Field>
            <Button type="submit" disabled={loading || question.trim().length < 3}>{loading ? <LoaderCircle className="animate-spin" data-icon="inline-start" /> : <Send data-icon="inline-start" />}{copy.assistantSend}</Button>
          </form>
          {error && <p role="alert" className="rounded-2xl border border-destructive/30 bg-[#FFF2F0] p-4 text-sm text-destructive">{error}</p>}
          {answer && <div aria-live="polite" className="border-t pt-5"><div className="flex items-center gap-2 font-semibold"><Bot className="size-5" />{copy.assistantTitle}</div><p className="mt-3 leading-7 text-muted-foreground">{answer}</p>{fallback && <p className="mt-3 text-xs font-medium text-warning">{copy.assistantFallback}</p>}{suggestions.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{suggestions.map((item) => <button key={item} type="button" onClick={() => setQuestion(item)} className="pressable min-h-11 rounded-full border bg-white px-4 py-2 text-left text-sm font-medium hover:bg-secondary">{item}</button>)}</div>}</div>}
        </div>
      </SheetContent>
    </Sheet>
  );
}
