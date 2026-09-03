import { NextResponse } from 'next/server';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { createRenewal, ensureSyntheticCitizen } from '@/lib/data';
import { readinessInputSchema } from '@/lib/validation';
import { z } from 'zod';

const createRenewalSchema = z.object({
  locale: z.enum(['en', 'hi']).default('en'),
  readiness: readinessInputSchema.optional(),
});

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  const parsed = createRenewalSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: 'Check the synthetic readiness answers.' }, { status: 400 });
  await ensureSyntheticCitizen(user, parsed.data.locale);
  const application = await createRenewal(user.userId, parsed.data.readiness);
  return NextResponse.json({ id: application.id }, { status: 201 });
}
