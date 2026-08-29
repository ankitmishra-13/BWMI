import { NextResponse } from 'next/server';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { advanceServiceApplication, completeServiceApplication, getServiceApplication } from '@/lib/data';
import { serviceApplicationUpdateSchema } from '@/lib/validation';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getChatGPTUser();
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  const { id } = await context.params;
  const parsed = serviceApplicationUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'This demo step is incomplete.' }, { status: 400 });
  const existing = await getServiceApplication(user.userId, id);
  if (!existing) return NextResponse.json({ error: 'Application not found.' }, { status: 404 });
  const application = parsed.data.step === 3
    ? await completeServiceApplication(user.userId, id)
    : await advanceServiceApplication(user.userId, id, parsed.data.step, parsed.data.step === 1 ? parsed.data.data.selection : undefined);
  return NextResponse.json({ application });
}
