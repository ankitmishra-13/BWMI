import Link from 'next/link';
import { FileText, LayoutDashboard, Search, Sparkles, UserRound } from 'lucide-react';
import { demoSignInPath, type ChatGPTUser } from '@/app/chatgpt-auth';
import { accountCopy, journeyCopy } from '@/lib/account-copy';
import { localPath, type Locale } from '@/lib/i18n';
import { portalCopy } from '@/lib/services';

export function SectionRail({ locale, user }: { locale: Locale; user?: ChatGPTUser | null }) {
  const portal = portalCopy[locale];
  const account = accountCopy[locale];
  const sectionLinks = [
    [portal.search, '#find-service', Search],
    [portal.popularEyebrow, '#popular', LayoutDashboard],
    [portal.indexEyebrow, '#service-index', FileText],
    [journeyCopy[locale].rail, '#why-raahi', Sparkles],
    [portal.renewalEyebrow, '#renewal-path', FileText],
  ] as const;
  const applicationsHref = user ? localPath(locale, '/applications') : demoSignInPath(localPath(locale, '/applications'));
  const profileHref = user ? localPath(locale, '/profile') : demoSignInPath(localPath(locale, '/profile'));

  return (
    <aside className="hidden md:block">
      <nav aria-label={locale === 'hi' ? 'पृष्ठ और खाता नेविगेशन' : 'Page and account navigation'} className="sticky top-28 flex max-h-[calc(100vh-8rem)] flex-col gap-1 overflow-y-auto pb-8 pt-16 text-sm">
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[.14em] text-muted-foreground">Raahi</p>
        {sectionLinks.map(([label, href, Icon], index) => <a key={href} href={href} className={`group flex min-h-11 items-center gap-2.5 rounded-full px-3 py-2 ${index === 0 ? 'bg-white font-medium shadow-sm' : 'text-muted-foreground hover:bg-white hover:text-foreground'}`}><Icon className="size-4 shrink-0" aria-hidden="true" />{label}</a>)}
        <div className="my-4 border-t" />
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[.14em] text-muted-foreground">{account.account}</p>
        <Link href={applicationsHref} className="flex min-h-11 items-center gap-2.5 rounded-full px-3 py-2 text-muted-foreground hover:bg-white hover:text-foreground"><FileText className="size-4" />{account.applications}</Link>
        <Link href={profileHref} className="flex min-h-11 items-center gap-2.5 rounded-full px-3 py-2 text-muted-foreground hover:bg-white hover:text-foreground"><UserRound className="size-4" />{account.profile}</Link>
      </nav>
    </aside>
  );
}
