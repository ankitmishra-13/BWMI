import Link from 'next/link';
import { ArrowRight, Languages, Link2, UserRound } from 'lucide-react';
import { requireAdmin } from '@/app/admin-auth';
import { AdminPageHeader } from '@/components/admin-page-header';
import { AdminShell } from '@/components/admin-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getAdminCitizens } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function AdminCitizensPage() {
  const admin = await requireAdmin();
  const citizens = await getAdminCitizens(admin);
  return <AdminShell admin={admin}><div className="mx-auto max-w-[1500px]"><AdminPageHeader current="Citizens" eyebrow="Synthetic citizen directory" title="Context without exposing identity" description="Only fictional profile summaries connected to applications in your permitted region are visible here." /><Card className="mt-7"><CardHeader className="border-b"><CardTitle>Accessible citizens</CardTitle><CardDescription>{citizens.length} synthetic citizen workspaces have an application in scope.</CardDescription></CardHeader><CardContent className="px-0">{citizens.length ? <Table><TableHeader><TableRow><TableHead>Citizen</TableHead><TableHead>Language</TableHead><TableHead>Source</TableHead><TableHead>Applications</TableHead><TableHead>Latest region</TableHead><TableHead><span className="sr-only">Open</span></TableHead></TableRow></TableHeader><TableBody>{citizens.map(({ profile, applications }) => { const latest = applications[0]; return <TableRow key={latest.application.userId}><TableCell><div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-secondary"><UserRound className="size-4" /></span><span><span className="block font-medium">{profile?.fullName ?? 'Synthetic citizen'}</span><span className="block text-xs text-muted-foreground">ID …{latest.application.userId.slice(-6)}</span></span></div></TableCell><TableCell><Badge variant="outline"><Languages />{profile?.preferredLocale === 'hi' ? 'Hindi' : 'English'}</Badge></TableCell><TableCell><span className="flex items-center gap-2 text-sm"><Link2 className="size-4 text-muted-foreground" />{profile?.digilockerLinked ? 'Mock DigiLocker' : 'Manual demo'}</span></TableCell><TableCell>{applications.length}</TableCell><TableCell>{latest.application.stateCode} · {latest.application.rtoCode}</TableCell><TableCell><Button asChild variant="ghost" size="sm"><Link href={`/admin/applications/${latest.application.id}`}>Latest<ArrowRight data-icon="inline-end" /></Link></Button></TableCell></TableRow>; })}</TableBody></Table> : <Empty className="min-h-72"><EmptyHeader><EmptyMedia variant="icon"><UserRound /></EmptyMedia><EmptyTitle>No citizens in this scope</EmptyTitle><EmptyDescription>Complete a citizen renewal journey or sign in with a broader demo role.</EmptyDescription></EmptyHeader></Empty>}</CardContent></Card></div></AdminShell>;
}
