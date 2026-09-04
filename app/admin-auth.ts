import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const ADMIN_SESSION_COOKIE = 'raahi_admin_session';
export const ADMIN_EMAIL = 'admin.demo@bwmi.test';
export const ADMIN_PASSWORD = 'RaahiAdmin#2026';
export const ADMIN_ID = 'demo-admin-bwmi-2026';

export type AdminRole = 'national-admin' | 'state-admin' | 'rto-reviewer' | 'support-viewer';

export type AdminSession = {
  adminId: string;
  email: string;
  name: string;
  role: AdminRole;
  regionCode: string | null;
  rtoCode: string | null;
  expiresAt: number;
};

type DemoAdminAccount = Omit<AdminSession, 'expiresAt'> & { password: string };

export const DEMO_ADMIN_ACCOUNTS: DemoAdminAccount[] = [
  { adminId: ADMIN_ID, email: ADMIN_EMAIL, password: ADMIN_PASSWORD, name: 'National demo admin', role: 'national-admin', regionCode: null, rtoCode: null },
  { adminId: 'demo-admin-delhi-2026', email: 'delhi.admin@bwmi.test', password: 'RaahiDelhi#2026', name: 'Delhi state admin', role: 'state-admin', regionCode: 'DL', rtoCode: null },
  { adminId: 'demo-reviewer-dl01-2026', email: 'reviewer.dl01@bwmi.test', password: 'RaahiReviewer#2026', name: 'DL-01 reviewer', role: 'rto-reviewer', regionCode: 'DL', rtoCode: 'DL-01' },
  { adminId: 'demo-support-2026', email: 'support.demo@bwmi.test', password: 'RaahiSupport#2026', name: 'National support viewer', role: 'support-viewer', regionCode: null, rtoCode: null },
];

export function authenticateAdmin(email: string, password: string) {
  return DEMO_ADMIN_ACCOUNTS.find((account) => account.email === email.trim().toLowerCase() && account.password === password) ?? null;
}

export async function createAdminSessionToken(account: DemoAdminAccount = DEMO_ADMIN_ACCOUNTS[0]) {
  const payload: AdminSession = {
    adminId: account.adminId, email: account.email, name: account.name, role: account.role,
    regionCode: account.regionCode, rtoCode: account.rtoCode, expiresAt: Date.now() + 8 * 60 * 60 * 1000,
  };
  const encoded = encodeBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  return `${encoded}.${await sign(encoded)}`;
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  const [encoded, signature, ...rest] = token.split('.');
  if (!encoded || !signature || rest.length || (await sign(encoded)) !== signature) return null;
  try {
    const payload = JSON.parse(new TextDecoder().decode(decodeBase64Url(encoded))) as AdminSession;
    const account = DEMO_ADMIN_ACCOUNTS.find((candidate) => candidate.adminId === payload.adminId && candidate.email === payload.email);
    if (!account || account.role !== payload.role || account.regionCode !== payload.regionCode || account.rtoCode !== payload.rtoCode || payload.expiresAt < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function canAccessRegion(admin: AdminSession, stateCode: string, rtoCode?: string | null) {
  if (admin.role === 'national-admin' || admin.role === 'support-viewer') return true;
  if (admin.regionCode !== stateCode) return false;
  return admin.role !== 'rto-reviewer' || admin.rtoCode === rtoCode;
}

export function canMutateApplications(admin: AdminSession) {
  return admin.role !== 'support-viewer';
}

export function adminRoleLabel(role: AdminRole) {
  if (role === 'national-admin') return 'National administrator';
  if (role === 'state-admin') return 'State / UT administrator';
  if (role === 'rto-reviewer') return 'RTO reviewer';
  return 'Support viewer';
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
