import { NextResponse } from 'next/server';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { createServiceApplication, ensureSyntheticCitizen } from '@/lib/data';
import { getService } from '@/lib/services';
import { serviceApplicationCreateSchema } from '@/lib/validation';

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  const parsed = serviceApplicationCreateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Unknown service request.' }, { status: 400 });
  const service = getService(parsed.data.serviceSlug);
  if (!service || service.mode !== 'transaction' || service.renewalFlow) return NextResponse.json({ error: 'This service uses a different prototype flow.' }, { status: 400 });
  await ensureSyntheticCitizen(user, parsed.data.locale);
  const application = await createServiceApplication(user.userId, service);
  return NextResponse.json({ id: application.id }, { status: 201 });
}
