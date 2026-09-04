import { NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, authenticateAdmin, createAdminSessionToken } from '@/app/admin-auth';

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  if (!form) {
    return NextResponse.json({ error: 'Submit admin credentials as form data.' }, { status: 400 });
  }
  const account = authenticateAdmin(String(form.get('email') ?? ''), String(form.get('password') ?? ''));
  if (!account) {
    return NextResponse.redirect(new URL('/admin/login?error=credentials', request.url), 303);
  }
  const response = NextResponse.redirect(new URL('/admin', request.url), 303);
  response.cookies.set(ADMIN_SESSION_COOKIE, await createAdminSessionToken(account), {
    httpOnly: true, sameSite: 'strict', secure: new URL(request.url).protocol === 'https:', path: '/', maxAge: 8 * 60 * 60,
  });
  return response;
}
