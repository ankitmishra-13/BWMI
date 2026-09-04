import Link from 'next/link';
import { AlertTriangle, ArrowRight, CheckCircle2, Clock3, Files, MapPinned } from 'lucide-react';
import { requireAdmin } from '@/app/admin-auth';
import { AdminApplicationTable } from '@/components/admin-application-table';
import { AdminPageHeader } from '@/components/admin-page-header';
import { AdminShell } from '@/components/admin-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getAdminOverview } from '@/lib/data';
import { getSyntheticRegionLoad, INDIA_REGIONS } from '@/lib/regions';

export const dynamic = 'force-dynamic';

export default async function AdminOverviewPage() {
  const admin = await requireAdmin();
  const { applications } = await getAdminOverview(admin);
  const actionRequired = applications.filter(({ application }) => application.status === 'Action required').length;
  const underReview = applications.filter(({ application }) => application.status === 'Under review').length;
  const approved = applications.filter(({ application }) => application.status === 'Approved').length;
  const nationalLoad = INDIA_REGIONS.map((region) => ({ region, ...getSyntheticRegionLoad(region.code) })).sort((a, b) => b.atRisk - a.atRisk).slice(0, 4);
  const funnel = [
    { label: 'Submitted', value: applications.filter(({ application }) => application.status === 'Submitted').length },
    { label: 'Documents', value: applications.filter(({ application }) => application.status === 'Documents checking').length },
    { label: 'Review', value: underReview },
    { label: 'Decision', value: approved },
  ];

  return <AdminShell admin={admin}><div className="mx-auto max-w-[1500px]">
    <AdminPageHeader eyebrow="National command centre" title="Operations at a glance" description="Start with queues needing attention, then drill into a state, RTO, or individual synthetic application. Data freshness: just now." action={<Button asChild><Link href="/admin/applications">Open application queue<ArrowRight data-icon="inline-end" /></Link></Button>} />
    <section aria-label="Key application counts" className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Metric title="Accessible renewals" value={applications.length} description="Within your role and regional scope" icon={Files} />
      <Metric title="Citizen action" value={actionRequired} description="Waiting for a clear citizen response" icon={AlertTriangle} />
      <Metric title="Under review" value={underReview} description="Owned by an operations reviewer" icon={Clock3} />
      <Metric title="Approved" value={approved} description="Synthetic decisions completed" icon={CheckCircle2} />
    </section>
    <div className="mt-7 grid gap-7 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,.65fr)]">
      <Card><CardHeader className="border-b"><CardTitle>Processing funnel</CardTitle><CardDescription>Current stage across accessible renewal applications.</CardDescription><CardAction><Badge variant="outline">{applications.length} live records</Badge></CardAction></CardHeader><CardContent className="grid gap-5 pt-1 sm:grid-cols-2">{funnel.map((item) => { const percent = applications.length ? Math.round(item.value / applications.length * 100) : 0; return <div key={item.label}><div className="flex items-center justify-between gap-3"><span className="text-sm font-medium">{item.label}</span><span className="text-sm font-semibold">{item.value}</span></div><Progress value={percent} className="mt-2 h-2" /><p className="mt-1 text-xs text-muted-foreground">{percent}% of accessible records</p></div>; })}</CardContent></Card>
      <Card><CardHeader className="border-b"><CardTitle>Regional watchlist</CardTitle><CardDescription>Synthetic workload signals across India.</CardDescription><CardAction><Button asChild variant="ghost" size="sm"><Link href="/admin/regions"><MapPinned data-icon="inline-start" />All regions</Link></Button></CardAction></CardHeader><CardContent className="flex flex-col gap-1">{nationalLoad.map(({ region, atRisk, actionRequired: needsAction }) => <Link key={region.code} href={`/admin/regions/${region.code.toLowerCase()}`} className="flex min-h-14 items-center gap-3 rounded-lg px-2 hover:bg-secondary"><span className="grid size-8 place-items-center rounded-lg bg-secondary text-xs font-semibold">{region.code}</span><span className="min-w-0 flex-1"><span className="block truncate font-medium">{region.name}</span><span className="block text-xs text-muted-foreground">{needsAction} citizen actions</span></span><Badge variant="outline">{atRisk} at risk</Badge></Link>)}</CardContent></Card>
    </div>
    <Card className="mt-7"><CardHeader className="border-b"><CardTitle>Applications needing a quick review</CardTitle><CardDescription>The latest accessible records. Use the full queue for filters and assignment.</CardDescription><CardAction><Button asChild variant="ghost" size="sm"><Link href="/admin/applications">View all<ArrowRight data-icon="inline-end" /></Link></Button></CardAction></CardHeader><CardContent className="px-0"><AdminApplicationTable rows={applications.slice(0, 6)} compact /></CardContent></Card>
  </div></AdminShell>;
}

function Metric({ title, value, description, icon: Icon }: { title: string; value: number; description: string; icon: typeof Files }) {
  return <Card><CardHeader><CardTitle className="flex items-center gap-2 text-sm"><Icon className="size-4 text-muted-foreground" />{title}</CardTitle><CardDescription>{description}</CardDescription></CardHeader><CardContent><p className="text-3xl font-semibold tracking-tight">{value}</p></CardContent></Card>;
}
