import Link from 'next/link';
import { ArrowLeft, FileCheck2, IdCard, Languages, Link2, MessageCircleMore, UserRound } from 'lucide-react';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/app/admin-auth';
import { AdminShell } from '@/components/admin-shell';
import { AdminStatusForm } from '@/components/admin-status-form';
import { ApplicationTimeline } from '@/components/application-timeline';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAdminApplication } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function AdminApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const data = await getAdminApplication(id);
  if (!data) notFound();
  const { application, profile, licence, events, audit } = data;
  return <AdminShell active="applications"><div className="mx-auto max-w-7xl"><Button asChild variant="ghost" size="sm"><Link href="/admin#applications"><ArrowLeft data-icon="inline-start" />Back to applications</Link></Button><div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.1em] text-muted-foreground">Renewal application</p><h1 className="mt-2 text-3xl sm:text-4xl">BWMI-{application.id.slice(0, 8).toUpperCase()}</h1><p className="mt-2 text-sm text-muted-foreground">Last updated {new Intl.DateTimeFormat('en-IN', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(application.updatedAt))}</p></div><Badge variant={application.status === 'Action required' ? 'destructive' : 'secondary'}>{application.status}</Badge></div><div className="mt-7"><ApplicationTimeline application={application} locale={profile?.preferredLocale === 'hi' ? 'hi' : 'en'} events={events} /></div><div className="mt-7 grid gap-7 xl:grid-cols-[minmax(0,1fr)_420px]"><div className="flex flex-col gap-7"><section className="rounded-xl border bg-card"><div className="border-b p-5"><h2 className="text-xl">Citizen and source record</h2><p className="mt-1 text-sm text-muted-foreground">Synthetic details only; no real identity is available to this admin.</p></div><dl className="grid sm:grid-cols-2"><Datum icon={UserRound} label="Citizen" value={profile?.fullName ?? 'Synthetic citizen'} /><Datum icon={IdCard} label="Licence" value={licence?.maskedNumber ?? 'Synthetic licence'} /><Datum icon={Languages} label="Preferred language" value={profile?.preferredLocale === 'hi' ? 'Hindi' : 'English'} /><Datum icon={Link2} label="Source" value={profile?.digilockerLinked ? 'Mock DigiLocker linked' : 'Manual synthetic record'} /></dl></section><section className="rounded-xl border bg-card"><div className="border-b p-5"><h2 className="text-xl">Status and delivery audit</h2><p className="mt-1 text-sm text-muted-foreground">Citizen-facing updates are preserved here.</p></div>{audit.length ? <ul className="divide-y">{audit.map((item) => <li key={item.id} className="p-5"><div className="flex flex-wrap items-center justify-between gap-3"><p className="font-semibold">{item.previousStatus} → {item.nextStatus}</p><Badge variant="outline">{item.whatsappQueued ? <MessageCircleMore /> : <FileCheck2 />}{item.whatsappQueued ? 'Mock WhatsApp queued' : 'In-app only'}</Badge></div><p className="mt-2 text-sm text-muted-foreground">{item.citizenMessage}</p><p className="mt-2 text-xs text-muted-foreground">{new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(item.createdAt))}</p></li>)}</ul> : <p className="p-8 text-sm text-muted-foreground">No admin updates have been published yet.</p>}</section></div><AdminStatusForm applicationId={application.id} initialStatus={application.status} initialProgress={application.progressPercent} /></div></div></AdminShell>;
}

function Datum({ icon: Icon, label, value }: { icon: typeof UserRound; label: string; value: string }) { return <div className="flex gap-3 border-b p-5 sm:border-r sm:even:border-r-0"><Icon className="mt-0.5 size-5 shrink-0 text-muted-foreground" /><div><dt className="text-xs font-semibold uppercase tracking-[.08em] text-muted-foreground">{label}</dt><dd className="mt-1 font-medium">{value}</dd></div></div>; }
