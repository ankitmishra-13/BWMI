import Link from 'next/link';
import { ArrowRight, CircleUserRound, Menu, Search, ShieldCheck } from 'lucide-react';
import { chatGPTSignOutPath, demoSignInPath, type ChatGPTUser } from '@/app/chatgpt-auth';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Button } from '@/components/ui/button';
import { getCopy, localPath, type Locale } from '@/lib/i18n';
import { categoryCopy, portalCopy, t } from '@/lib/services';

const primaryCategories = ['licence', 'vehicle', 'compliance', 'guides'] as const;

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

      <header className="ios-glass sticky top-0 z-30 border-b border-foreground/8">
        <div className="shell flex h-16 items-center gap-4">
          <Link href={localPath(locale)} className="group flex shrink-0 items-center gap-2 rounded-full" aria-label={`${portal.brand} — ${portal.home}`}>
            <span className="relative size-3 rounded-full bg-primary after:absolute after:-right-1.5 after:-top-1.5 after:size-1.5 after:rounded-full after:bg-[#8DA5BE]" aria-hidden="true" />
            <span className="font-heading text-[1.35rem] font-semibold leading-none tracking-[-.035em]">{portal.brand}</span>
          </Link>

          <nav aria-label="Primary" className="ml-6 hidden h-full shrink-0 items-center gap-1 lg:flex">
            <Link href={localPath(locale)} className="flex h-10 shrink-0 items-center whitespace-nowrap rounded-full px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">{portal.home}</Link>
            <Link href={localPath(locale, '/services')} className="flex h-10 shrink-0 items-center whitespace-nowrap rounded-full px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">{portal.allServices}</Link>
            {primaryCategories.map((category) => (
              <Link key={category} href={localPath(locale, `/services?category=${category}`)} className="flex h-10 shrink-0 items-center whitespace-nowrap rounded-full px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                {t(categoryCopy[category].short, locale)}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-1.5">
            <Button asChild variant="ghost" size="sm" className="hidden 2xl:inline-flex">
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
                <Menu aria-hidden="true" />
              </summary>
              <div className="ios-glass absolute right-0 top-14 w-[min(92vw,370px)] rounded-[1.75rem] border border-foreground/10 p-4 shadow-[0_30px_80px_rgba(10,10,10,.15)]">
                <form action={localPath(locale, '/services')} className="mb-4" role="search" aria-label={locale === 'hi' ? 'मोबाइल सेवा खोज' : 'Mobile service search'}>
                  <label htmlFor="mobile-search" className="px-1 text-xs font-semibold text-muted-foreground">{portal.search}</label>
                  <div className="mt-2 flex items-center rounded-2xl border bg-white px-3 focus-within:ring-3 focus-within:ring-ring/25">
                    <Search className="size-4 text-muted-foreground" aria-hidden="true" />
                    <input id="mobile-search" name="q" type="search" placeholder={portal.searchPlaceholder} className="h-12 min-w-0 flex-1 bg-transparent px-3 text-sm outline-none" />
                    <button type="submit" className="min-h-11 px-2 text-sm font-semibold">{portal.searchAction}</button>
                  </div>
                </form>
                <nav aria-label="Mobile primary" className="flex max-h-[65vh] flex-col overflow-y-auto border-y">
                  <Link href={localPath(locale)} className="flex min-h-12 items-center justify-between border-b py-2 font-medium">{portal.home}<ArrowRight className="size-4 text-muted-foreground" /></Link>
                  <Link href={localPath(locale, '/services')} className="flex min-h-12 items-center justify-between border-b py-2 font-medium">{portal.allServices}<ArrowRight className="size-4 text-muted-foreground" /></Link>
                  {primaryCategories.map((category) => (
                    <Link key={category} href={localPath(locale, `/services?category=${category}`)} className="flex min-h-12 items-center justify-between border-b py-2 font-medium last:border-0">
                      {t(categoryCopy[category].title, locale)}<ArrowRight className="size-4 text-muted-foreground" />
                    </Link>
                  ))}
                </nav>
                {user ? (
                  <Button asChild variant="secondary" className="mt-4 w-full"><Link href={localPath(locale, '/dashboard')}><CircleUserRound data-icon="inline-start" />{portal.dashboard}</Link></Button>
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

function AccountActions({ locale, user }: { locale: Locale; user: ChatGPTUser }) {
  const portal = portalCopy[locale];
  return (
    <>
      <Button asChild variant="secondary" size="sm" className="hidden md:inline-flex">
        <Link href={localPath(locale, '/dashboard')}><CircleUserRound data-icon="inline-start" />{portal.dashboard}</Link>
      </Button>
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
