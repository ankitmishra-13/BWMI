import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock3, FileStack, UserCheck } from 'lucide-react';
import { canAccessRegion, requireAdmin } from '@/app/admin-auth';
import { AdminApplicationTable } from '@/components/admin-application-table';
import { AdminPageHeader } from '@/components/admin-page-header';
import { AdminShell } from '@/components/admin-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getAdminOverview } from '@/lib/data';
import { getRegion, getSyntheticRegionLoad } from '@/lib/regions';

export const dynamic = 'force-dynamic';

export default async function AdminRegionPage({ params }: { params: Promise<{ code: string }> }) {
  const admin = await requireAdmin();
  const { code: rawCode } = await params;
  const region = getRegion(rawCode);
  if (!region || !canAccessRegion(admin, region.code, admin.rtoCode ?? `${region.code}-01`)) notFound();
  const { applications } = await getAdminOverview(admin);
  const rows = applications.filter(({ application }) => application.stateCode === region.code);
  const load = getSyntheticRegionLoad(region.code);
  const rtos = [1, 2, 3].map((number) => {
    const code = `${region.code}-${String(number).padStart(2, '0')}`;
    return { code, office: number === 1 ? `${region.capital} central` : `${region.capital} zone ${number}`, live: rows.filter(({ application }) => application.rtoCode === code).length, pending: Math.max(2, (load.received + number * 7) % 31) };
  }).filter((rto) => admin.role !== 'rto-reviewer' || rto.code === admin.rtoCode);
  return <AdminShell admin={admin}><div className="mx-auto max-w-[1500px]"><Button asChild variant="ghost" size="sm"><Link href="/admin/regions"><ArrowLeft data-icon="inline-start" />Back to regions</Link></Button><div className="mt-5"><AdminPageHeader current={region.name} eyebrow={`${region.kind} · ${region.code}`} title={`${region.name} operations`} description={`Regional synthetic workload centred on ${region.capital}. Updates made here appear on the citizen timeline for accessible applications.`} /></div>
    <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Stat icon={FileStack} label="Sample received" value={load.received} detail="Synthetic workload baseline" /><Stat icon={Clock3} label="At SLA risk" value={load.atRisk} detail="Suggested review priority" /><Stat icon={UserCheck} label="Citizen action" value={load.actionRequired} detail="Needs a clear next step" /><Card><CardHeader><CardTitle className="text-sm">Completion rate</CardTitle><CardDescription>Synthetic regional signal</CardDescription></CardHeader><CardContent><p className="text-3xl font-semibold">{load.completionRate}%</p><Progress value={load.completionRate} className="mt-3" /></CardContent></Card></section>
    <div className="mt-7 grid gap-7 xl:grid-cols-[.75fr_1.25fr]"><Card><CardHeader className="border-b"><CardTitle>Sample RTO offices</CardTitle><CardDescription>Fictional routing nodes for the prototype.</CardDescription></CardHeader><CardContent className="px-0"><Table><TableHeader><TableRow><TableHead>Office</TableHead><TableHead>Live</TableHead><TableHead>Sample queue</TableHead></TableRow></TableHeader><TableBody>{rtos.map((rto) => <TableRow key={rto.code}><TableCell><p className="font-medium">{rto.code}</p><p className="text-xs text-muted-foreground">{rto.office}</p></TableCell><TableCell>{rto.live}</TableCell><TableCell><Badge variant="secondary">{rto.pending} pending</Badge></TableCell></TableRow>)}</TableBody></Table></CardContent></Card><Card><CardHeader className="border-b"><CardTitle>Regional application queue</CardTitle><CardDescription>{rows.length} live synthetic records assigned to {region.code}.</CardDescription></CardHeader><CardContent className="px-0"><AdminApplicationTable rows={rows} compact /></CardContent></Card></div>
  </div></AdminShell>;
}

function Stat({ icon: Icon, label, value, detail }: { icon: typeof FileStack; label: string; value: number; detail: string }) {
  return <Card><CardHeader><CardTitle className="flex items-center gap-2 text-sm"><Icon className="size-4 text-muted-foreground" />{label}</CardTitle><CardDescription>{detail}</CardDescription></CardHeader><CardContent><p className="text-3xl font-semibold">{value}</p></CardContent></Card>;
}
