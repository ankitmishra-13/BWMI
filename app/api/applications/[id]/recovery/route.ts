import { NextResponse } from 'next/server';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { recordRecoveryEvent } from '@/lib/data';
import { recoveryEventSchema } from '@/lib/validation';

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getChatGPTUser();
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  const parsed = recoveryEventSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Unknown recovery event.' }, { status: 400 });
  const { id } = await context.params;
  const event = await recordRecoveryEvent(user.userId, id, parsed.data);
  if (!event) return NextResponse.json({ error: 'Application not found.' }, { status: 404 });
  return NextResponse.json(event, { status: 201 });
}
