import Link from 'next/link';
import { ArrowRight, CircleUserRound, FileText, LogOut, Search, ShieldCheck, UserRound } from 'lucide-react';
import { accountCopy } from '@/lib/account-copy';
import { chatGPTSignOutPath, demoSignInPath, type ChatGPTUser } from '@/app/chatgpt-auth';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ServiceNavigationMenu } from '@/components/service-navigation-menu';
import { Button } from '@/components/ui/button';
import { getCopy, localPath, type Locale } from '@/lib/i18n';
import { categoryCopy, categoryOrder, portalCopy, t } from '@/lib/services';

export function SiteHeader({ locale, user }: { locale: Locale; user?: ChatGPTUser | null }) {
  const copy = getCopy(locale);
  const portal = portalCopy[locale];

  return (
    <>
      <a href="#main" className="sr-only bg-background px-4 py-3 focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:not-sr-only">{copy.skip}</a>
      <aside aria-label={portal.prototype} className="bg-primary text-primary-foreground">
        <div className="shell flex min-h-8 items-center justify-center gap-2 py-1.5 text-center text-[11px] font-medium tracking-[.01em] sm:text-xs">
          <ShieldCheck aria-hidden="true" className="size-3.5 shrink-0" />
          {portal.prototype}
        </div>
      </aside>

      <header className="site-header-chrome sticky top-0 z-30 border-b border-foreground/8">
        <div className="shell flex h-[4.5rem] items-center gap-4">
          <Link href={localPath(locale)} className="group flex shrink-0 items-center gap-2 rounded-full" aria-label={`${portal.brand} — ${portal.home}`}>
            <span className="relative size-3 rounded-full bg-primary after:absolute after:-right-1.5 after:-top-1.5 after:size-1.5 after:rounded-full after:bg-[#8DA5BE]" aria-hidden="true" />
            <span className="flex flex-col">
              <span className="font-heading text-[1.4rem] font-semibold leading-none tracking-[-.035em]">{portal.brand}</span>
              <span className="mt-1 hidden text-[.58rem] font-semibold uppercase tracking-[.14em] text-muted-foreground 2xl:block">{locale === 'hi' ? 'नागरिक परिवहन' : 'Citizen transport'}</span>
            </span>
          </Link>

          <nav aria-label="Primary" className="ml-4 hidden h-full min-w-0 items-center lg:flex">
            <ServiceNavigationMenu locale={locale} />
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-1.5">
            <Button asChild variant="secondary" size="sm" className="hidden xl:inline-flex">
              <Link href={localPath(locale, '/services')}><Search data-icon="inline-start" />{portal.search}</Link>
            </Button>
            <LanguageSwitcher locale={locale} copy={copy} />
            {user ? <AccountActions locale={locale} user={user} /> : (
              <Button asChild size="sm" className="hidden sm:inline-flex">
                <Link href={demoSignInPath(localPath(locale, '/dashboard'))}>{portal.signIn}<ArrowRight data-icon="inline-end" /></Link>
              </Button>
            )}

            <details className="mobile-nav relative lg:hidden">
              <summary className="pressable flex size-11 cursor-pointer list-none items-center justify-center rounded-full border bg-white/90 [&::-webkit-details-marker]:hidden" aria-label={portal.menu}>
                <span className="menu-glyph" aria-hidden="true"><span /><span /><span /></span>
              </summary>
              <div className="mobile-menu-panel absolute right-0 top-14 max-h-[calc(100svh-7.5rem)] w-[min(92vw,370px)] overflow-y-auto overscroll-contain rounded-[1.75rem] border border-foreground/10 p-4 shadow-[0_30px_80px_rgba(16,42,67,.18)]">
                <form action={localPath(locale, '/services')} className="mb-4" role="search" aria-label={locale === 'hi' ? 'मोबाइल सेवा खोज' : 'Mobile service search'}>
                  <label htmlFor="mobile-search" className="px-1 text-xs font-semibold text-muted-foreground">{portal.search}</label>
                  <div className="mt-2 flex items-center rounded-2xl border bg-white px-3 focus-within:ring-3 focus-within:ring-ring/25">
                    <Search className="size-4 text-muted-foreground" aria-hidden="true" />
                    <input id="mobile-search" name="q" type="search" placeholder={portal.searchPlaceholder} className="h-12 min-w-0 flex-1 bg-transparent px-3 text-sm outline-none" />
                    <button type="submit" className="min-h-11 px-2 text-sm font-semibold">{portal.searchAction}</button>
                  </div>
                </form>
                <nav aria-label="Mobile primary" className="flex flex-col border-y">
                  <Link href={localPath(locale)} className="flex min-h-12 items-center justify-between border-b py-2 font-medium">{portal.home}<ArrowRight className="size-4 text-muted-foreground" /></Link>
                  <Link href={localPath(locale, '/services')} className="flex min-h-12 items-center justify-between border-b py-2 font-medium">{portal.allServices}<ArrowRight className="size-4 text-muted-foreground" /></Link>
                  {categoryOrder.map((category) => (
                    <Link key={category} href={localPath(locale, `/services?category=${category}`)} className="flex min-h-12 items-center justify-between border-b py-2 font-medium last:border-0">
                      {t(categoryCopy[category].title, locale)}<ArrowRight className="size-4 text-muted-foreground" />
                    </Link>
                  ))}
                </nav>
                {user ? (
                  <div className="mt-4 grid gap-2">
                    <div className="grid gap-2 min-[360px]:grid-cols-2">
                      <Button asChild variant="secondary" className="min-w-0"><Link href={localPath(locale, '/applications')}><FileText data-icon="inline-start" />{accountCopy[locale].applications}</Link></Button>
                      <Button asChild variant="outline" className="min-w-0"><Link href={localPath(locale, '/profile')}><UserRound data-icon="inline-start" />{accountCopy[locale].profile}</Link></Button>
                    </div>
                    <MobileSignOut locale={locale} user={user} />
                  </div>
                ) : (
                  <Button asChild className="mt-4 w-full"><Link href={demoSignInPath(localPath(locale, '/dashboard'))}>{portal.signIn}<ArrowRight data-icon="inline-end" /></Link></Button>
                )}
              </div>
            </details>
          </div>
        </div>
      </header>
    </>
  );
}

function MobileSignOut({ locale, user }: { locale: Locale; user: ChatGPTUser }) {
  const portal = portalCopy[locale];
  return user.authSource === 'demo' ? (
    <form action="/api/demo-auth/logout" method="post" className="w-full">
      <input type="hidden" name="returnTo" value={localPath(locale)} />
      <Button type="submit" variant="outline" className="w-full"><LogOut data-icon="inline-start" />{portal.signOut}</Button>
    </form>
  ) : (
    <Button asChild variant="outline" className="w-full"><a href={chatGPTSignOutPath(localPath(locale))}><LogOut data-icon="inline-start" />{portal.signOut}</a></Button>
  );
}

function AccountActions({ locale, user }: { locale: Locale; user: ChatGPTUser }) {
  const portal = portalCopy[locale];
  const account = accountCopy[locale];
  return (
    <>
      <Button asChild variant="secondary" size="sm" className="hidden md:inline-flex">
        <Link href={localPath(locale, '/applications')}><CircleUserRound data-icon="inline-start" />{account.applications}</Link>
      </Button>
      <Button asChild variant="ghost" size="sm" className="hidden xl:inline-flex"><Link href={localPath(locale, '/profile')}><UserRound data-icon="inline-start" />{account.profile}</Link></Button>
      {user.authSource === 'demo' ? (
        <form action="/api/demo-auth/logout" method="post" className="hidden sm:block">
          <input type="hidden" name="returnTo" value={localPath(locale)} />
          <Button type="submit" variant="outline" size="sm">{portal.signOut}</Button>
        </form>
      ) : (
        <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex"><a href={chatGPTSignOutPath(localPath(locale))}>{portal.signOut}</a></Button>
      )}
    </>
  );
}
