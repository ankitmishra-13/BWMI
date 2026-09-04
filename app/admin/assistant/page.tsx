import { requireAdmin } from '@/app/admin-auth';
import { AdminAssistant } from '@/components/admin-assistant';
import { AdminShell } from '@/components/admin-shell';

export const dynamic = 'force-dynamic';

export default async function AdminAssistantPage() {
  const admin = await requireAdmin();
  return <AdminShell admin={admin}><AdminAssistant admin={admin} /></AdminShell>;
}
