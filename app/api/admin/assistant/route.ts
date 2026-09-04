import { NextResponse } from 'next/server';
import { canAccessRegion, getAdminSession } from '@/app/admin-auth';
import { getAdminApplication, getAdminOverview, recordAdminAssistantRequest } from '@/lib/data';
import { getRegion } from '@/lib/regions';
import { adminAssistantSchema } from '@/lib/validation';

function containsPersonalIdentifier(value: string) {
  return /\b\d{10,}\b|[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(value);
}

export async function POST(request: Request) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: 'Admin authentication required.' }, { status: 401 });
  const parsed = adminAssistantSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Ask a question of 3–300 characters.' }, { status: 400 });
  if (containsPersonalIdentifier(parsed.data.question)) return NextResponse.json({ error: 'Remove contact details or real personal identifiers.' }, { status: 400 });

  const requestedRegion = parsed.data.stateCode ?? admin.regionCode;
  if (requestedRegion && !canAccessRegion(admin, requestedRegion, admin.rtoCode ?? `${requestedRegion}-01`)) {
    return NextResponse.json({ error: 'This region is outside your demo role.' }, { status: 403 });
  }

  const detail = parsed.data.applicationId ? await getAdminApplication(parsed.data.applicationId, admin) : null;
  if (parsed.data.applicationId && !detail) return NextResponse.json({ error: 'Application not found in your permitted scope.' }, { status: 404 });
  const overview = detail ? null : await getAdminOverview(admin);
  const scopedApplications = overview?.applications.filter(({ application }) => !requestedRegion || application.stateCode === requestedRegion) ?? [];
  const fallback = !process.env.OPENAI_API_KEY;
  if (!await recordAdminAssistantRequest(admin, {
    applicationId: parsed.data.applicationId, stateCode: requestedRegion ?? undefined,
    contextType: parsed.data.contextType, questionLength: parsed.data.question.length, usedFallback: fallback,
  })) return NextResponse.json({ error: 'Copilot request limit reached. Use the visible queue data for now.' }, { status: 429 });

  const safeContext = detail ? {
    type: 'application',
    reference: `BWMI-${detail.application.id.slice(0, 8).toUpperCase()}`,
    status: detail.application.status,
    progressPercent: detail.application.progressPercent,
    stateCode: detail.application.stateCode,
    district: detail.application.districtName,
    rtoCode: detail.application.rtoCode,
    priority: detail.application.priority,
    slaDueAt: detail.application.slaDueAt,
    statusEvents: detail.events.slice(0, 5).map((event) => ({ eventType: event.eventType, description: event.descriptionEn, createdAt: event.createdAt })),
  } : {
    type: 'queue',
    region: requestedRegion ? getRegion(requestedRegion)?.name ?? requestedRegion : 'All India',
    total: scopedApplications.length,
    actionRequired: scopedApplications.filter(({ application }) => application.status === 'Action required').length,
    underReview: scopedApplications.filter(({ application }) => application.status === 'Under review').length,
    submitted: scopedApplications.filter(({ application }) => application.status === 'Submitted').length,
    highPriority: scopedApplications.filter(({ application }) => application.priority === 'High').length,
  };
  const evidence = detail
    ? [`Synthetic application ${safeContext.reference}`, `${detail.application.stateCode} · ${detail.application.rtoCode} permission scope`, 'Citizen-safe workflow and status events']
    : [`${safeContext.region} permitted queue`, `${scopedApplications.length} accessible synthetic applications`, `${admin.role} access policy`];
  const suggestions = detail
    ? ['What needs attention?', 'Draft a plain-language citizen update', 'Explain the next operational step']
    : ['Which queue needs attention?', 'Summarise regional workload', 'What should I review first?'];

  const builtInAnswer = detail
    ? `${safeContext.reference} is ${detail.application.status.toLowerCase()} at ${detail.application.progressPercent}% in ${detail.application.rtoCode}. ${detail.application.status === 'Action required' ? 'The next useful step is to review the latest citizen-facing issue before publishing another update.' : 'Review the latest event and SLA before choosing the next status.'} Any status or message change still requires explicit administrator confirmation.`
    : `This permitted queue contains ${scopedApplications.length} synthetic applications. ${scopedApplications.filter(({ application }) => application.status === 'Action required').length} need citizen action and ${scopedApplications.filter(({ application }) => application.status === 'Under review').length} are under review. Start with action-required items, then check the oldest SLA due time. No change will be applied automatically.`;
  if (fallback) return NextResponse.json({ answer: builtInAnswer, evidence, suggestions, fallback: true });

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST', signal: AbortSignal.timeout(7_000),
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-5.6-luna', reasoning: { effort: 'low' }, max_output_tokens: 260,
        instructions: 'You are Raahi Ops Copilot for a synthetic Indian transport-service hackathon. Give a concise operational answer using only the supplied redacted context. Never claim government access, infer identity, make a legal decision, approve or reject an application, or say an action was performed. End with a human-review next step.',
        input: `Admin question: ${parsed.data.question}\nPermitted redacted context: ${JSON.stringify(safeContext)}`,
      }),
    });
    if (!response.ok) throw new Error('AI unavailable');
    const data = await response.json() as { output?: Array<{ content?: Array<{ type?: string; text?: string }> }> };
    const answer = data.output?.flatMap((item) => item.content ?? []).find((item) => item.type === 'output_text')?.text;
    if (!answer) throw new Error('No answer');
    return NextResponse.json({ answer, evidence, suggestions, fallback: false });
  } catch {
    return NextResponse.json({ answer: builtInAnswer, evidence, suggestions, fallback: true });
  }
}
