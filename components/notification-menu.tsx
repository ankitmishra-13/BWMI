'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { Bell, BellRing, CheckCheck, MessageCircleMore } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { localPath, type Locale } from '@/lib/i18n';

type NotificationItem = { id: string; applicationId: string; titleEn: string; titleHi: string; bodyEn: string; bodyHi: string; channel: string; read: boolean; createdAt: string };
const subscribe = () => () => undefined;

export function NotificationMenu({ locale }: { locale: Locale }) {
  const hi = locale === 'hi';
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unread, setUnread] = useState(0);
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const load = useCallback(async () => {
    const response = await fetch('/api/notifications', { cache: 'no-store' }).catch(() => null);
    if (!response?.ok) return;
    const payload = await response.json() as { items: NotificationItem[]; unread: number };
    setItems(payload.items); setUnread(payload.unread);
  }, []);
  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); const refresh = () => void load(); window.addEventListener('focus', refresh); return () => { window.clearTimeout(timer); window.removeEventListener('focus', refresh); }; }, [load]);
  async function markRead(id?: string) {
    await fetch('/api/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(id ? { id } : {}) }).catch(() => null);
    setItems((current) => current.map((item) => id && item.id !== id ? item : { ...item, read: true }));
    setUnread((current) => id ? Math.max(0, current - 1) : 0);
  }
  if (!hydrated) return <Button variant="ghost" size="icon" className="rounded-full" aria-label={hi ? 'सूचनाएँ' : 'Notifications'}><Bell /></Button>;
  return <DropdownMenu onOpenChange={(open) => { if (open) void load(); }}><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="relative rounded-full" aria-label={hi ? `सूचनाएँ, ${unread} अपठित` : `Notifications, ${unread} unread`}>{unread ? <BellRing /> : <Bell />}{unread > 0 && <span className="absolute right-0 top-0 grid min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-4 text-white" aria-hidden="true">{Math.min(unread, 9)}</span>}</Button></DropdownMenuTrigger><DropdownMenuContent align="end" sideOffset={10} className="max-h-[min(70svh,520px)] w-[min(92vw,390px)] overflow-y-auto rounded-2xl p-2"><DropdownMenuLabel className="flex items-center justify-between gap-3 px-3 py-2"><span><span className="block font-semibold text-foreground">{hi ? 'आपकी सूचनाएँ' : 'Your notifications'}</span><span className="mt-0.5 block text-xs font-normal">{hi ? 'आवेदन अपडेट और अगला कदम' : 'Application updates and next actions'}</span></span>{unread > 0 && <Button type="button" variant="ghost" size="sm" onClick={() => void markRead()}><CheckCheck data-icon="inline-start" />{hi ? 'सब पढ़ा' : 'Mark all read'}</Button>}</DropdownMenuLabel><DropdownMenuSeparator />{items.length ? <DropdownMenuGroup>{items.map((item) => <DropdownMenuItem key={item.id} asChild className="items-start rounded-xl p-3"><Link href={localPath(locale, `/status/${item.applicationId}`)} onClick={() => { if (!item.read) void markRead(item.id); }}><span className={`mt-1 size-2 shrink-0 rounded-full ${item.read ? 'bg-border' : 'bg-primary'}`} aria-hidden="true" /><span className="min-w-0 flex-1"><span className="block font-semibold text-foreground">{hi ? item.titleHi : item.titleEn}</span><span className="mt-1 block whitespace-normal text-xs leading-5 text-muted-foreground">{hi ? item.bodyHi : item.bodyEn}</span><span className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">{new Intl.DateTimeFormat(hi ? 'hi-IN' : 'en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(item.createdAt))}{item.channel.includes('WhatsApp') && <Badge variant="outline"><MessageCircleMore />{hi ? 'मॉक WhatsApp' : 'Mock WhatsApp'}</Badge>}</span></span></Link></DropdownMenuItem>)}</DropdownMenuGroup> : <div className="px-4 py-10 text-center"><Bell className="mx-auto size-6 text-muted-foreground" /><p className="mt-3 font-semibold">{hi ? 'अभी कोई सूचना नहीं' : 'No notifications yet'}</p><p className="mt-1 text-xs text-muted-foreground">{hi ? 'आवेदन बदलने पर यहाँ स्पष्ट अपडेट मिलेगा।' : 'Clear updates will appear when an application changes.'}</p></div>}</DropdownMenuContent></DropdownMenu>;
}
