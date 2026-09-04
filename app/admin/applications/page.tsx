import { requireAdmin } from '@/app/admin-auth';
import { AdminApplicationTable } from '@/components/admin-application-table';
import { AdminPageHeader } from '@/components/admin-page-header';
import { AdminShell } from '@/components/admin-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAdminOverview } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function AdminApplicationsPage() {
  const admin = await requireAdmin();
  const { applications } = await getAdminOverview(admin);
  return <AdminShell admin={admin}><div className="mx-auto max-w-[1500px]"><AdminPageHeader current="Applications" eyebrow="Application centre" title="One queue, clear ownership" description="Search by reference, citizen, district, or RTO. Filters never reveal records outside the signed-in administrator's permission scope." /><Card className="mt-7"><CardHeader className="border-b"><CardTitle>Renewal applications</CardTitle><CardDescription>{applications.length} synthetic records are available to this role.</CardDescription></CardHeader><CardContent className="px-0"><AdminApplicationTable rows={applications} /></CardContent></Card></div></AdminShell>;
}
