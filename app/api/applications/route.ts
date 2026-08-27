import { NextResponse } from 'next/server';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { createRenewal, ensureSyntheticCitizen } from '@/lib/data';
import { isLocale } from '@/lib/i18n';

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  const body: unknown = await request.json().catch(() => ({}));
  const requestedLocale = typeof body === 'object' && body !== null && 'locale' in body ? body.locale : undefined;
  const locale = typeof requestedLocale === 'string' && isLocale(requestedLocale) ? requestedLocale : 'en';
  await ensureSyntheticCitizen(user, locale);
  const application = await createRenewal(user.userId);
  return NextResponse.json({ id: application.id }, { status: 201 });
}
