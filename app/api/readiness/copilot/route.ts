import { NextResponse } from 'next/server';
import { interpretCitizenMessage } from '@/lib/readiness';
import { readinessCopilotOutputSchema, readinessCopilotSchema } from '@/lib/validation';

function containsIdentifier(value: string) {
  return /\b\d{10,}\b|[\w.+-]+@[\w.-]+\.[a-z]{2,}|\b[A-Z]{2}[- ]?\d{2}[- ][A-Z0-9-]{4,}/i.test(value);
}

export async function POST(request: Request) {
  const parsed = readinessCopilotSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Use 3–300 characters.' }, { status: 400 });
  if (containsIdentifier(parsed.data.message)) return NextResponse.json({ error: parsed.data.locale === 'hi' ? 'वास्तविक पहचान या संपर्क विवरण हटाएँ।' : 'Remove real identity or contact details.' }, { status: 400 });

  const fallback = interpretCitizenMessage(parsed.data.message, parsed.data.locale);
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ ...fallback, fallback: true });

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      signal: AbortSignal.timeout(6_000),
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-5.6-luna',
        reasoning: { effort: 'low' },
        max_output_tokens: 260,
        instructions: `Extract only non-sensitive renewal-readiness fields from the citizen message. Never decide eligibility or invent a government rule. Return only JSON with fields, summary, and followUp. Valid fields: ageBand under-40|40-59|60-plus; licenceType private|transport; expirySituation more-than-year|within-year|expired-under-year|expired-over-year; issueState Delhi|Maharashtra|Karnataka; addressChanged boolean; servicePreference standard|assisted; preferredLocale en|hi. Reply text in ${parsed.data.locale === 'hi' ? 'simple Hindi' : 'simple English'}.`,
        input: parsed.data.message,
      }),
    });
    if (!response.ok) throw new Error('AI unavailable');
    const data = await response.json() as { output?: Array<{ content?: Array<{ type?: string; text?: string }> }> };
    const output = data.output?.flatMap((item) => item.content ?? []).find((item) => item.type === 'output_text')?.text;
    if (!output) throw new Error('No output');
    const json = JSON.parse(output.replace(/^```json\s*|\s*```$/g, '')) as unknown;
    const validated = readinessCopilotOutputSchema.safeParse(json);
    if (!validated.success) throw new Error('Invalid output');
    return NextResponse.json({ ...validated.data, fallback: false });
  } catch {
    return NextResponse.json({ ...fallback, fallback: true });
  }
}
