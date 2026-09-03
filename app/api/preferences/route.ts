import { NextResponse } from 'next/server';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { getCitizenPreferences, updateCitizenPreferences } from '@/lib/data';
import { citizenPreferenceSchema } from '@/lib/validation';

export async function GET() {
  const user = await getChatGPTUser();
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  return NextResponse.json(await getCitizenPreferences(user.userId));
}

export async function PATCH(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  const parsed = citizenPreferenceSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Check the display preferences.' }, { status: 400 });
  return NextResponse.json(await updateCitizenPreferences(user.userId, parsed.data));
}
