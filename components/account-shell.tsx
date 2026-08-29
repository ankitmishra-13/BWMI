import Link from 'next/link';
import { FileText, LayoutDashboard, Search, UserRound } from 'lucide-react';
import { accountCopy } from '@/lib/account-copy';
import { localPath, type Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

type AccountRoute = 'overview' | 'applications' | 'profile';

export function AccountShell({ locale, active, children }: { locale: Locale; active: AccountRoute; children: React.ReactNode }) {
  const copy = accountCopy[locale];
  const links = [
    { id: 'overview', label: copy.overview, href: localPath(locale, '/dashboard'), icon: LayoutDashboard },
    { id: 'applications', label: copy.applications, href: localPath(locale, '/applications'), icon: FileText },
    { id: 'profile', label: copy.profile, href: localPath(locale, '/profile'), icon: UserRound },
    { id: 'services', label: copy.services, href: localPath(locale, '/services'), icon: Search },
  ] as const;
  return (
    <div className="shell grid min-w-0 max-w-full gap-7 lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-12">
      <aside className="min-w-0 max-w-full">
        <nav aria-label={copy.account} className="account-nav-scroll sticky top-28 flex w-full max-w-full gap-2 overflow-x-auto overscroll-x-contain pb-2 lg:flex-col lg:overflow-visible">
          <div className="mb-4 hidden px-3 lg:block"><p className="eyebrow">{copy.account}</p><p className="mt-1 text-xs text-muted-foreground">{copy.accountHint}</p></div>
          {links.map(({ id, label, href, icon: Icon }) => {
            const current = id === active;
            return <Link key={id} href={href} aria-current={current ? 'page' : undefined} className={cn('flex min-h-11 shrink-0 items-center gap-3 rounded-full px-4 text-sm font-medium transition-colors lg:w-full', current ? 'bg-primary text-primary-foreground shadow-[0_8px_24px_rgba(10,10,10,.12)]' : 'border bg-white/72 text-muted-foreground hover:bg-white hover:text-foreground')}><Icon className="size-4" aria-hidden="true" />{label}</Link>;
          })}
        </nav>
      </aside>
      <div className="min-w-0 max-w-full overflow-x-clip">{children}</div>
    </div>
  );
}
