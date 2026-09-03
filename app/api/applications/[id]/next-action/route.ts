import { NextResponse } from 'next/server';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { updateNextActionState } from '@/lib/data';
import { nextActionUpdateSchema } from '@/lib/validation';

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getChatGPTUser();
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  const parsed = nextActionUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Check the action-required update.' }, { status: 400 });
  const { id } = await context.params;
  const result = await updateNextActionState(user.userId, id, parsed.data.action, parsed.data.action === 'resolve' ? parsed.data.fileName : undefined);
  if (!result) return NextResponse.json({ error: 'Application not found.' }, { status: 404 });
  return NextResponse.json({ status: result.application.status });
}
