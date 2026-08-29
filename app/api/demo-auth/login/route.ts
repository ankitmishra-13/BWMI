import { NextResponse } from 'next/server';
import {
  createDemoSessionToken,
  DEMO_EMAIL,
  DEMO_PASSWORD,
  DEMO_SESSION_COOKIE,
  safeRelativeReturnPath,
} from '@/app/chatgpt-auth';

export async function POST(request: Request) {
  const form = await request.formData();
  const email = String(form.get('email') ?? '').trim().toLowerCase();
  const password = String(form.get('password') ?? '');
  const returnTo = safeRelativeReturnPath(String(form.get('returnTo') ?? '/en/dashboard'));
  const locale = returnTo.startsWith('/hi') ? 'hi' : 'en';

  if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
    const failed = new URL(`/${locale}/login`, request.url);
    failed.searchParams.set('returnTo', returnTo);
    failed.searchParams.set('error', 'credentials');
    return NextResponse.redirect(failed, 303);
  }

  const response = NextResponse.redirect(new URL(returnTo, request.url), 303);
  response.cookies.set(DEMO_SESSION_COOKIE, await createDemoSessionToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: new URL(request.url).protocol === 'https:',
    path: '/',
    maxAge: 12 * 60 * 60,
  });
  return response;
}
