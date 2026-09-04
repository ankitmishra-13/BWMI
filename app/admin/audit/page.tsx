import Link from 'next/link';
import { CheckCircle2, MessageCircleMore, ScrollText } from 'lucide-react';
import { requireAdmin } from '@/app/admin-auth';
import { AdminPageHeader } from '@/components/admin-page-header';
import { AdminShell } from '@/components/admin-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getAdminAudit } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function AdminAuditPage() {
  const admin = await requireAdmin();
  const audit = await getAdminAudit(admin);
  return <AdminShell admin={admin}><div className="mx-auto max-w-[1500px]"><AdminPageHeader current="Audit trail" eyebrow="Operational governance" title="Every published change stays explainable" description="Review who changed a synthetic application, what the citizen saw, and which simulated delivery channel was selected." /><Card className="mt-7"><CardHeader className="border-b"><CardTitle>Status-change audit</CardTitle><CardDescription>{audit.length} permitted administrative events.</CardDescription></CardHeader><CardContent className="px-0">{audit.length ? <Table><TableHeader><TableRow><TableHead>Timestamp</TableHead><TableHead>Administrator</TableHead><TableHead>Application</TableHead><TableHead>Transition</TableHead><TableHead>Citizen message</TableHead><TableHead>Delivery</TableHead></TableRow></TableHeader><TableBody>{audit.map((item) => <TableRow key={item.id}><TableCell className="text-xs text-muted-foreground">{new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(item.createdAt))}</TableCell><TableCell className="font-mono text-xs">{item.adminId}</TableCell><TableCell><Button asChild variant="link" className="h-auto px-0 font-mono text-xs"><Link href={`/admin/applications/${item.applicationId}`}>BWMI-{item.applicationId.slice(0, 8).toUpperCase()}</Link></Button></TableCell><TableCell><span className="font-medium">{item.previousStatus}</span><span className="mx-2 text-muted-foreground">→</span><span className="font-medium">{item.nextStatus}</span><p className="text-xs text-muted-foreground">{item.progressPercent}%</p></TableCell><TableCell className="max-w-lg text-xs text-muted-foreground">{item.citizenMessage}</TableCell><TableCell><Badge variant="outline">{item.whatsappQueued ? <MessageCircleMore /> : <CheckCircle2 />}{item.whatsappQueued ? 'Mock WhatsApp' : 'In-app'}</Badge></TableCell></TableRow>)}</TableBody></Table> : <Empty className="min-h-72"><EmptyHeader><EmptyMedia variant="icon"><ScrollText /></EmptyMedia><EmptyTitle>No published changes</EmptyTitle><EmptyDescription>The audit trail begins when an administrator publishes the first citizen status update.</EmptyDescription></EmptyHeader></Empty>}</CardContent></Card></div></AdminShell>;
}
