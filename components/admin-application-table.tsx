'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowRight, FileSearch, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type ApplicationRow = {
  application: {
    id: string; userId: string; status: string; progressPercent: number; stateCode: string; districtName: string;
    rtoCode: string; priority: string; slaDueAt: string | null; updatedAt: string;
  };
  profile: { fullName: string; preferredLocale: string } | null;
  licence: { maskedNumber: string } | null;
};

function formatSla(value: string | null) {
  if (!value) return 'Not set';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Migration required';

  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(date);
}

export function AdminApplicationTable({ rows, compact = false }: { rows: ApplicationRow[]; compact?: boolean }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [region, setRegion] = useState('all');
  const regions = useMemo(() => [...new Set(rows.map(({ application }) => application.stateCode))].sort(), [rows]);
  const filtered = useMemo(() => rows.filter(({ application, profile }) => {
    const haystack = `${application.id} ${application.rtoCode} ${application.districtName} ${profile?.fullName ?? ''}`.toLowerCase();
    return haystack.includes(query.toLowerCase()) && (status === 'all' || application.status === status) && (region === 'all' || application.stateCode === region);
  }), [query, region, rows, status]);

  return <div>
    {!compact && <div className="border-b bg-secondary/25 p-4 sm:p-5"><FieldGroup className="grid gap-3 sm:grid-cols-[minmax(240px,1fr)_220px_160px]">
      <Field><FieldLabel htmlFor="application-search">Search applications</FieldLabel><div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="application-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Reference, citizen, district, or RTO" className="pl-9" /></div></Field>
      <Field><FieldLabel>Status</FieldLabel><Select value={status} onValueChange={setStatus}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{['all', 'Submitted', 'Documents checking', 'Under review', 'Approved', 'Action required', 'Draft'].map((item) => <SelectItem key={item} value={item}>{item === 'all' ? 'All statuses' : item}</SelectItem>)}</SelectGroup></SelectContent></Select></Field>
      <Field><FieldLabel>Region</FieldLabel><Select value={region} onValueChange={setRegion}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectGroup><SelectItem value="all">All regions</SelectItem>{regions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectGroup></SelectContent></Select></Field>
    </FieldGroup></div>}
    {filtered.length ? <Table><TableHeader><TableRow><TableHead>Application</TableHead><TableHead>Citizen</TableHead><TableHead>Region</TableHead><TableHead>Status</TableHead><TableHead>Progress</TableHead><TableHead>SLA</TableHead><TableHead><span className="sr-only">Actions</span></TableHead></TableRow></TableHeader><TableBody>{filtered.map(({ application, profile, licence }) => <TableRow key={application.id}><TableCell><p className="font-mono text-xs font-semibold">BWMI-{application.id.slice(0, 8).toUpperCase()}</p><p className="mt-1 text-xs text-muted-foreground">{licence?.maskedNumber ?? 'Synthetic licence'}</p></TableCell><TableCell><p className="font-medium">{profile?.fullName ?? 'Synthetic citizen'}</p><p className="mt-1 text-xs text-muted-foreground">{profile?.preferredLocale === 'hi' ? 'Hindi' : 'English'}</p></TableCell><TableCell><p className="font-medium">{application.stateCode}</p><p className="text-xs text-muted-foreground">{application.rtoCode}</p></TableCell><TableCell><Badge variant={application.status === 'Action required' ? 'destructive' : 'secondary'}>{application.status}</Badge>{application.priority === 'High' && <Badge variant="outline" className="ml-1">High</Badge>}</TableCell><TableCell><div className="w-24"><span className="text-xs">{application.progressPercent}%</span><Progress value={application.progressPercent} className="mt-1 h-1.5" /></div></TableCell><TableCell className="text-xs text-muted-foreground">{formatSla(application.slaDueAt)}</TableCell><TableCell><Button asChild variant="ghost" size="sm"><Link href={`/admin/applications/${application.id}`}>Manage<ArrowRight data-icon="inline-end" /></Link></Button></TableCell></TableRow>)}</TableBody></Table> : <Empty className="min-h-64"><EmptyHeader><EmptyMedia variant="icon"><FileSearch /></EmptyMedia><EmptyTitle>No matching applications</EmptyTitle><EmptyDescription>Change the filters or complete a synthetic citizen journey to add another application.</EmptyDescription></EmptyHeader></Empty>}
  </div>;
}
