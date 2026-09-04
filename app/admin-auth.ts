import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const ADMIN_SESSION_COOKIE = 'raahi_admin_session';
export const ADMIN_EMAIL = 'admin.demo@bwmi.test';
export const ADMIN_PASSWORD = 'RaahiAdmin#2026';
export const ADMIN_ID = 'demo-admin-bwmi-2026';

type AdminPayload = { adminId: string; email: string; expiresAt: number };

export async function createAdminSessionToken() {
  const payload: AdminPayload = { adminId: ADMIN_ID, email: ADMIN_EMAIL, expiresAt: Date.now() + 8 * 60 * 60 * 1000 };
  const encoded = encodeBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  return `${encoded}.${await sign(encoded)}`;
}

export async function getAdminSession() {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  const [encoded, signature, ...rest] = token.split('.');
  if (!encoded || !signature || rest.length || (await sign(encoded)) !== signature) return null;
  try {
    const payload = JSON.parse(new TextDecoder().decode(decodeBase64Url(encoded))) as AdminPayload;
    if (payload.adminId !== ADMIN_ID || payload.email !== ADMIN_EMAIL || payload.expiresAt < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (session) return session;
  redirect('/admin/login');
}

async function sign(value: string) {
  const secret = process.env.DEMO_SESSION_SECRET || 'raahi-local-demo-session-only';
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(`${secret}:admin`), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value));
  return encodeBase64Url(new Uint8Array(signature));
}

function encodeBase64Url(bytes: Uint8Array) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/u, '');
}

function decodeBase64Url(value: string) {
  const base64 = value.replaceAll('-', '+').replaceAll('_', '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  const binary = atob(base64);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}
