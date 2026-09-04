import { NextResponse } from 'next/server';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { getNotifications, markNotificationsRead } from '@/lib/data';

export async function GET() {
  const user = await getChatGPTUser();
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  const items = await getNotifications(user.userId);
  return NextResponse.json({ items, unread: items.filter((item) => !item.read).length });
}

export async function PATCH(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  const payload = await request.json().catch(() => ({})) as { id?: string };
  await markNotificationsRead(user.userId, typeof payload.id === 'string' ? payload.id : undefined);
  return NextResponse.json({ ok: true });
}
