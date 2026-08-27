import { NextResponse } from 'next/server';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { applyApplicationUpdate } from '@/lib/data';
import { applicationUpdateSchema } from '@/lib/validation';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getChatGPTUser();
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  const { id } = await context.params;
  const parsed = applicationUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'The submitted step is incomplete.', issues: parsed.error.flatten() }, { status: 400 });
  }
  try {
    const bundle = await applyApplicationUpdate(user.userId, id, parsed.data);
    if (!bundle) return NextResponse.json({ error: 'Application not found.' }, { status: 404 });
    return NextResponse.json({
      application: bundle.application,
      documents: bundle.documents,
      payment: bundle.payment,
    });
  } catch {
    return NextResponse.json({ error: 'The step could not be saved.' }, { status: 500 });
  }
}
