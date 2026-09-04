import Link from 'next/link';
import { ArrowRight, Building2, MapPinned } from 'lucide-react';
import { canAccessRegion, requireAdmin } from '@/app/admin-auth';
import { AdminPageHeader } from '@/components/admin-page-header';
import { AdminShell } from '@/components/admin-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getAdminOverview } from '@/lib/data';
import { getSyntheticRegionLoad, INDIA_REGIONS } from '@/lib/regions';

export const dynamic = 'force-dynamic';

export default async function AdminRegionsPage() {
  const admin = await requireAdmin();
  const { applications } = await getAdminOverview(admin);
  const regions = INDIA_REGIONS.filter((region) => canAccessRegion(admin, region.code, admin.rtoCode ?? `${region.code}-01`));
  const stateCount = regions.filter((region) => region.kind === 'State').length;
  const territoryCount = regions.length - stateCount;
  return <AdminShell admin={admin}><div className="mx-auto max-w-[1500px]"><AdminPageHeader current="Regions" eyebrow="Regional operations" title="Every jurisdiction, one shared view" description="Drill from national workload into a state or union territory. Workload figures are deterministic synthetic demo data; accessible application counts come from the prototype database." />
    <section className="mt-7 grid gap-4 sm:grid-cols-3"><Summary title="Accessible regions" value={regions.length} detail={`${stateCount} states · ${territoryCount} union territories`} /><Summary title="Live demo records" value={applications.length} detail="Permission-filtered applications" /><Summary title="Sample RTO offices" value={regions.length * 3} detail="Three fictional offices per region" /></section>
    <Card className="mt-7"><CardHeader className="border-b"><CardTitle>State and union-territory control</CardTitle><CardDescription>All 36 Indian jurisdictions are seeded for the national role.</CardDescription></CardHeader><CardContent className="px-0"><Table><TableHeader><TableRow><TableHead>Region</TableHead><TableHead>Type</TableHead><TableHead>Live records</TableHead><TableHead>Sample received</TableHead><TableHead>At risk</TableHead><TableHead>Completion</TableHead><TableHead><span className="sr-only">Open</span></TableHead></TableRow></TableHeader><TableBody>{regions.map((region) => { const load = getSyntheticRegionLoad(region.code); const actual = applications.filter(({ application }) => application.stateCode === region.code).length; return <TableRow key={region.code}><TableCell><div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-lg bg-secondary text-xs font-semibold"><MapPinned className="size-4" /></span><span><span className="block font-medium">{region.name}</span><span className="text-xs text-muted-foreground">{region.code} · {region.capital}</span></span></div></TableCell><TableCell><Badge variant="outline">{region.kind}</Badge></TableCell><TableCell>{actual}</TableCell><TableCell>{load.received}</TableCell><TableCell>{load.atRisk}</TableCell><TableCell><div className="w-28"><span className="text-xs">{load.completionRate}%</span><Progress value={load.completionRate} className="mt-1 h-1.5" /></div></TableCell><TableCell><Button asChild variant="ghost" size="sm"><Link href={`/admin/regions/${region.code.toLowerCase()}`}>Open<ArrowRight data-icon="inline-end" /></Link></Button></TableCell></TableRow>; })}</TableBody></Table></CardContent></Card>
  </div></AdminShell>;
}

function Summary({ title, value, detail }: { title: string; value: number; detail: string }) {
  return <Card><CardHeader><CardTitle className="flex items-center gap-2 text-sm"><Building2 className="size-4 text-muted-foreground" />{title}</CardTitle><CardDescription>{detail}</CardDescription></CardHeader><CardContent><p className="text-3xl font-semibold">{value}</p></CardContent></Card>;
}
