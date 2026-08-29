import { NextResponse } from 'next/server';
import { DEMO_SESSION_COOKIE, safeRelativeReturnPath } from '@/app/chatgpt-auth';

export async function POST(request: Request) {
  const form = await request.formData();
  const returnTo = safeRelativeReturnPath(String(form.get('returnTo') ?? '/en'));
  const response = NextResponse.redirect(new URL(returnTo, request.url), 303);
  response.cookies.set(DEMO_SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: new URL(request.url).protocol === 'https:',
    path: '/',
    maxAge: 0,
  });
  return response;
}
