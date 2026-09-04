import { NextResponse } from 'next/server';
import { createDemoSessionToken, DEMO_SESSION_COOKIE, safeRelativeReturnPath, type ChatGPTUser } from '@/app/chatgpt-auth';
import { ensureSyntheticCitizen } from '@/lib/data';
import { syntheticRegistrationSchema } from '@/lib/validation';

export async function POST(request: Request) {
  const form = await request.formData();
  const parsed = syntheticRegistrationSchema.safeParse({
    fullName: form.get('fullName'), email: form.get('email'), syntheticPhone: form.get('syntheticPhone'),
    locale: form.get('locale'), otp: form.get('otp'), digilockerConsent: form.get('digilockerConsent'),
  });
  const locale = form.get('locale') === 'hi' ? 'hi' : 'en';
  const returnTo = safeRelativeReturnPath(String(form.get('returnTo') ?? `/${locale}/dashboard`));
  if (!parsed.success) {
    const failed = new URL(`/${locale}/register`, request.url);
    failed.searchParams.set('error', 'registration');
    return NextResponse.redirect(failed, 303);
  }

  const user: ChatGPTUser = {
    userId: `demo-citizen-${crypto.randomUUID()}`,
    email: parsed.data.email.toLowerCase(), fullName: parsed.data.fullName,
    displayName: parsed.data.fullName, authSource: 'demo',
  };
  await ensureSyntheticCitizen(user, parsed.data.locale, { syntheticPhone: parsed.data.syntheticPhone, digilockerLinked: true });
  const response = NextResponse.redirect(new URL(returnTo, request.url), 303);
  response.cookies.set(DEMO_SESSION_COOKIE, await createDemoSessionToken({ userId: user.userId, email: user.email, fullName: parsed.data.fullName }), {
    httpOnly: true, sameSite: 'lax', secure: new URL(request.url).protocol === 'https:', path: '/', maxAge: 12 * 60 * 60,
  });
  return response;
}
