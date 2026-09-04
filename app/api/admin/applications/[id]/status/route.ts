import { NextResponse } from 'next/server';
import { getAdminSession } from '@/app/admin-auth';
import { adminUpdateApplication } from '@/lib/data';
import { adminStatusUpdateSchema } from '@/lib/validation';

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: 'Admin authentication required.' }, { status: 401 });
  const parsed = adminStatusUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Check the status, progress, and citizen update.' }, { status: 400 });
  const { id } = await context.params;
  const result = await adminUpdateApplication(admin.adminId, id, parsed.data);
  if (!result) return NextResponse.json({ error: 'Application not found.' }, { status: 404 });
  return NextResponse.json({ application: result.application });
}
