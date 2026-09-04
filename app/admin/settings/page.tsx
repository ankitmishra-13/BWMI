import { Database, LockKeyhole, MessageCircleMore, ShieldCheck, UsersRound } from 'lucide-react';
import { adminRoleLabel, DEMO_ADMIN_ACCOUNTS, requireAdmin } from '@/app/admin-auth';
import { AdminPageHeader } from '@/components/admin-page-header';
import { AdminShell } from '@/components/admin-shell';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const admin = await requireAdmin();
  return <AdminShell admin={admin}><div className="mx-auto max-w-[1200px]"><AdminPageHeader current="Settings" eyebrow="Demo configuration" title="Safe defaults, visible boundaries" description="Inspect the role model and integrations represented in this hackathon prototype. These controls describe the demo; they do not connect external services." />
    <Alert className="mt-7 bg-secondary/55"><ShieldCheck /><AlertTitle>Independent synthetic prototype</AlertTitle><AlertDescription>All identities, regions, application records, DigiLocker activity, WhatsApp deliveries, and decisions are simulated. Raahi is not an official government service.</AlertDescription></Alert>
    <div className="mt-7 grid gap-7 lg:grid-cols-[1.3fr_.7fr]"><Card><CardHeader className="border-b"><CardTitle className="flex items-center gap-2"><UsersRound className="size-5" />Demo role directory</CardTitle><CardDescription>Sign in with a listed public account to verify regional isolation.</CardDescription></CardHeader><CardContent className="px-0"><Table><TableHeader><TableRow><TableHead>Role</TableHead><TableHead>Email</TableHead><TableHead>Password</TableHead><TableHead>Scope</TableHead></TableRow></TableHeader><TableBody>{DEMO_ADMIN_ACCOUNTS.map((account) => <TableRow key={account.adminId}><TableCell><Badge variant={account.role === admin.role ? 'default' : 'outline'}>{adminRoleLabel(account.role)}</Badge></TableCell><TableCell className="font-mono text-xs">{account.email}</TableCell><TableCell className="font-mono text-xs">{account.password}</TableCell><TableCell>{account.rtoCode ?? account.regionCode ?? 'All India'}{account.role === 'support-viewer' && ' · read only'}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card><div className="flex flex-col gap-5"><Boundary icon={Database} title="Prototype database" text="Cloudflare D1 stores only synthetic records and harmless document metadata." /><Boundary icon={MessageCircleMore} title="Mock delivery" text="WhatsApp selections create audit records only. No phone number receives a message." /><Boundary icon={LockKeyhole} title="Human decisions" text="Ops Copilot is read-only. Every status update requires an authorised administrator." /></div></div>
  </div></AdminShell>;
}

function Boundary({ icon: Icon, title, text }: { icon: typeof Database; title: string; text: string }) { return <Card><CardHeader><CardTitle className="flex items-center gap-2 text-sm"><Icon className="size-4" />{title}</CardTitle><CardDescription>{text}</CardDescription></CardHeader></Card>; }
