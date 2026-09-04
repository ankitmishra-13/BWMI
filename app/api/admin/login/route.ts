import { NextResponse } from 'next/server';
import { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_SESSION_COOKIE, createAdminSessionToken } from '@/app/admin-auth';

export async function POST(request: Request) {
  const form = await request.formData();
  if (String(form.get('email') ?? '').trim().toLowerCase() !== ADMIN_EMAIL || String(form.get('password') ?? '') !== ADMIN_PASSWORD) {
    return NextResponse.redirect(new URL('/admin/login?error=credentials', request.url), 303);
  }
  const response = NextResponse.redirect(new URL('/admin', request.url), 303);
  response.cookies.set(ADMIN_SESSION_COOKIE, await createAdminSessionToken(), {
    httpOnly: true, sameSite: 'strict', secure: new URL(request.url).protocol === 'https:', path: '/', maxAge: 8 * 60 * 60,
  });
  return response;
}
