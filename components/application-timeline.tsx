import { Check, CircleAlert, Clock3, FileSearch, Scale, Send, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { RenewalApplication, StatusEvent } from '@/db/schema';
import type { Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const stages = [
  { status: 'Submitted', en: 'Submitted', hi: 'जमा', ownerEn: 'Raahi', ownerHi: 'Raahi', icon: Send },
  { status: 'Documents checking', en: 'Documents checking', hi: 'दस्तावेज़ जाँच', ownerEn: 'Document team', ownerHi: 'दस्तावेज़ टीम', icon: FileSearch },
  { status: 'Under review', en: 'Under review', hi: 'समीक्षा जारी', ownerEn: 'Review team', ownerHi: 'समीक्षा टीम', icon: Scale },
  { status: 'Approved', en: 'Decision', hi: 'निर्णय', ownerEn: 'Issuing team', ownerHi: 'जारीकर्ता टीम', icon: ShieldCheck },
] as const;

export function ApplicationTimeline({ application, locale, events = [], compact = false }: { application: RenewalApplication; locale: Locale; events?: StatusEvent[]; compact?: boolean }) {
  const hi = locale === 'hi';
  const actionRequired = application.status === 'Action required';
  const current = actionRequired ? 1 : Math.max(0, stages.findIndex((stage) => stage.status === application.status));
  const latest = [...events].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  const nextAction = actionRequired
    ? (hi ? 'नमूना सुधार भेजें ताकि समीक्षा फिर शुरू हो सके।' : 'Send the sample correction so review can resume.')
    : application.status === 'Approved'
      ? (hi ? 'कोई कार्रवाई नहीं—काल्पनिक निर्णय पूरा है।' : 'No action—the synthetic decision is complete.')
      : (hi ? 'अभी कोई कार्रवाई नहीं। अगला बदलाव सूचना में मिलेगा।' : 'Nothing needed now. The next change will arrive as a notification.');
  return <section aria-labelledby={`timeline-${application.id}`} className={cn('overflow-hidden rounded-[1.75rem] border bg-card', !compact && 'shadow-[0_18px_50px_rgba(62,48,31,.06)]')}><div className="flex flex-col gap-5 border-b p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6"><div><div className="flex flex-wrap items-center gap-2"><p className="eyebrow">{hi ? 'लाइव आवेदन प्रगति' : 'Live application progress'}</p>{actionRequired && <Badge variant="destructive"><CircleAlert />{hi ? 'आपकी कार्रवाई चाहिए' : 'Your action is needed'}</Badge>}</div><h2 id={`timeline-${application.id}`} className="mt-2 text-2xl">{hi ? 'हर चरण, एक स्पष्ट मालिक।' : 'Every stage, one clear owner.'}</h2><p className="mt-2 max-w-2xl text-sm text-muted-foreground">{nextAction}</p></div><div className="shrink-0 sm:text-right"><p className="text-2xl font-semibold tracking-tight">{application.progressPercent}%</p><p className="text-xs text-muted-foreground">{hi ? 'पूरा' : 'complete'}</p></div></div><div className="p-5 sm:p-6"><Progress value={application.progressPercent} className="h-2" /><ol className="mt-6 grid gap-1 sm:grid-cols-4">{stages.map((stage, index) => { const complete = index < current || application.status === 'Approved'; const active = index === current && application.status !== 'Approved'; const Icon = stage.icon; return <li key={stage.status} className="relative grid grid-cols-[36px_1fr] gap-3 pb-5 last:pb-0 sm:block sm:pb-0 sm:pr-4"><span aria-hidden="true" className={cn('relative z-10 grid size-9 place-items-center rounded-full border-2', complete ? 'border-success bg-success text-white' : active ? 'border-primary bg-card text-primary' : 'border-border bg-muted text-muted-foreground')}>{complete ? <Check className="size-4" /> : active ? <Clock3 className="size-4" /> : <Icon className="size-4" />}</span>{index < stages.length - 1 && <span aria-hidden="true" className="absolute left-[17px] top-9 h-[calc(100%-24px)] w-px bg-border sm:left-9 sm:right-0 sm:top-[17px] sm:h-px sm:w-auto" />}<div className="pt-1 sm:mt-3 sm:pt-0"><p className={cn('text-sm font-semibold', active || complete ? 'text-foreground' : 'text-muted-foreground')}>{hi ? stage.hi : stage.en}</p><p className="mt-0.5 text-xs text-muted-foreground">{hi ? stage.ownerHi : stage.ownerEn}</p></div></li>; })}</ol>{latest && !compact && <div className="mt-6 border-t pt-4"><p className="text-xs font-semibold uppercase tracking-[.09em] text-muted-foreground">{hi ? 'नवीनतम अपडेट' : 'Latest update'}</p><p className="mt-1 text-sm font-medium">{hi ? latest.descriptionHi : latest.descriptionEn}</p></div>}</div></section>;
}
