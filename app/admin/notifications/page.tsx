import Link from 'next/link';
import { BellRing, CheckCircle2, MessageCircleMore } from 'lucide-react';
import { requireAdmin } from '@/app/admin-auth';
import { AdminPageHeader } from '@/components/admin-page-header';
import { AdminShell } from '@/components/admin-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getAdminNotifications } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function AdminNotificationsPage() {
  const admin = await requireAdmin();
  const notifications = await getAdminNotifications(admin);
  const whatsapp = notifications.filter((item) => item.channel.includes('WhatsApp')).length;
  return <AdminShell admin={admin}><div className="mx-auto max-w-[1500px]"><AdminPageHeader current="Notifications" eyebrow="Citizen communication" title="Every update, one delivery record" description="Review in-app notifications and clearly labelled mock WhatsApp deliveries. Nothing on this page contacts a real phone number." />
    <section className="mt-7 grid gap-4 sm:grid-cols-3"><Summary label="Delivery records" value={notifications.length} detail="In your permitted scope" /><Summary label="Mock WhatsApp" value={whatsapp} detail="Simulation only" /><Summary label="In-app only" value={notifications.length - whatsapp} detail="Visible in Raahi" /></section>
    <Card className="mt-7"><CardHeader className="border-b"><CardTitle>Delivery log</CardTitle><CardDescription>Newest citizen-facing update first.</CardDescription></CardHeader><CardContent className="px-0">{notifications.length ? <Table><TableHeader><TableRow><TableHead>Created</TableHead><TableHead>Application</TableHead><TableHead>Update</TableHead><TableHead>Channel</TableHead><TableHead>Citizen state</TableHead></TableRow></TableHeader><TableBody>{notifications.map((item) => <TableRow key={item.id}><TableCell className="text-xs text-muted-foreground">{new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(item.createdAt))}</TableCell><TableCell><Button asChild variant="link" className="h-auto px-0 font-mono text-xs"><Link href={`/admin/applications/${item.applicationId}`}>BWMI-{item.applicationId.slice(0, 8).toUpperCase()}</Link></Button></TableCell><TableCell><p className="font-medium">{item.titleEn}</p><p className="mt-1 max-w-xl text-xs text-muted-foreground">{item.bodyEn}</p></TableCell><TableCell><Badge variant="outline">{item.channel.includes('WhatsApp') ? <MessageCircleMore /> : <BellRing />}{item.channel.includes('WhatsApp') ? 'Mock WhatsApp + in-app' : 'In-app'}</Badge></TableCell><TableCell><Badge variant={item.read ? 'secondary' : 'default'}>{item.read ? <CheckCircle2 /> : <BellRing />}{item.read ? 'Read' : 'Unread'}</Badge></TableCell></TableRow>)}</TableBody></Table> : <Empty className="min-h-72"><EmptyHeader><EmptyMedia variant="icon"><BellRing /></EmptyMedia><EmptyTitle>No deliveries yet</EmptyTitle><EmptyDescription>Publish an application update to create an in-app and optional mock WhatsApp record.</EmptyDescription></EmptyHeader></Empty>}</CardContent></Card>
  </div></AdminShell>;
}

function Summary({ label, value, detail }: { label: string; value: number; detail: string }) { return <Card><CardHeader><CardTitle className="text-sm">{label}</CardTitle><CardDescription>{detail}</CardDescription></CardHeader><CardContent><p className="text-3xl font-semibold">{value}</p></CardContent></Card>; }
