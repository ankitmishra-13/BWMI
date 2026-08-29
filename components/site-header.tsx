import Link from 'next/link';
import { ArrowRight, ChevronDown, CircleUserRound, Compass, Menu, Route, Search, ShieldCheck } from 'lucide-react';
import { chatGPTSignOutPath, demoSignInPath, type ChatGPTUser } from '@/app/chatgpt-auth';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Button } from '@/components/ui/button';
import { getCopy, localPath, type Locale } from '@/lib/i18n';
import { categoryCopy, categoryOrder, portalCopy, servicePath, servicesByCategory, t } from '@/lib/services';

export function SiteHeader({ locale, user }: { locale: Locale; user?: ChatGPTUser | null }) {
  const copy = getCopy(locale);
  const portal = portalCopy[locale];

  return (
    <>
      <a href="#main" className="sr-only z-50 bg-white px-4 py-3 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">{copy.skip}</a>
      <div className="civic-rule" />
      <aside aria-label={portal.prototype} className="border-b bg-[#102A43] text-white">
        <div className="shell flex min-h-10 items-center justify-center gap-2 py-2 text-center text-xs font-medium sm:text-sm">
          <ShieldCheck aria-hidden="true" className="size-4 shrink-0 text-[#F2B36E]" />{portal.prototype}
        </div>
      </aside>

      <header className="relative z-30 border-b bg-white/95 backdrop-blur-sm">
        <div className="shell flex min-h-20 items-center gap-4 py-3">
          <Link href={localPath(locale)} className="group flex min-w-0 items-center gap-3 rounded-md" aria-label={`${portal.brand} — ${portal.home}`}>
            <span className="relative grid size-11 shrink-0 place-items-center rounded-full border-2 border-[#0F766E] text-[#0F766E]"><Route aria-hidden="true" className="size-5" /><span className="absolute -right-1 -top-1 size-3 rounded-full border-2 border-white bg-[#C76A15]" /></span>
            <span className="min-w-0"><span className="block font-heading text-2xl font-bold leading-none tracking-[-.02em]">{portal.brand}</span><span className="hidden truncate text-[11px] font-medium text-[#52667A] sm:block">{portal.brandLine}</span></span>
          </Link>

          <form action={localPath(locale, '/services')} className="ml-auto hidden min-w-0 max-w-md flex-1 lg:flex" role="search" aria-label={locale === 'hi' ? 'वैश्विक सेवा खोज' : 'Global service search'}>
            <label htmlFor="header-search" className="sr-only">{portal.search}</label>
            <div className="flex w-full items-center rounded-full border bg-[#F6F8FB] px-4 focus-within:outline focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-[#2563EB]">
              <Search className="size-4 shrink-0 text-[#52667A]" aria-hidden="true" />
              <input id="header-search" name="q" type="search" placeholder={portal.searchPlaceholder} className="h-11 min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-[#71869A]" />
              <button type="submit" className="min-h-9 rounded-full px-3 text-sm font-semibold text-[#0F766E]">{portal.searchAction}</button>
            </div>
          </form>

          <div className="ml-auto flex items-center gap-1 lg:ml-0">
            <LanguageSwitcher locale={locale} copy={copy} />
            {user ? <AccountActions locale={locale} user={user} /> : <Button asChild className="hidden h-11 bg-[#0F766E] px-4 hover:bg-[#0B5F59] sm:inline-flex"><Link href={demoSignInPath(localPath(locale, '/dashboard'))}>{portal.signIn}<ArrowRight /></Link></Button>}
            <details className="mobile-nav relative lg:hidden">
              <summary className="flex size-11 cursor-pointer list-none items-center justify-center rounded-xl border bg-white [&::-webkit-details-marker]:hidden" aria-label={portal.menu}><Menu aria-hidden="true" /></summary>
              <div className="absolute right-0 top-14 w-[min(92vw,360px)] rounded-2xl border bg-white p-4 shadow-[0_24px_70px_rgba(16,42,67,.18)]">
                <form action={localPath(locale, '/services')} className="mb-4" role="search" aria-label={locale === 'hi' ? 'मोबाइल सेवा खोज' : 'Mobile service search'}>
                  <label htmlFor="mobile-search" className="text-xs font-semibold uppercase tracking-wider text-[#52667A]">{portal.search}</label>
                  <div className="mt-2 flex items-center rounded-xl border bg-[#F6F8FB] px-3"><Search className="size-4 text-[#52667A]" /><input id="mobile-search" name="q" type="search" placeholder={portal.searchPlaceholder} className="h-11 min-w-0 flex-1 bg-transparent px-2 text-sm outline-none" /><button type="submit" className="min-h-9 px-2 font-semibold text-[#0F766E]">{portal.searchAction}</button></div>
                </form>
                <nav aria-label="Mobile primary" className="max-h-[65vh] overflow-y-auto">
                  <Link href={localPath(locale)} className="flex min-h-11 items-center border-b py-2 font-semibold">{portal.home}</Link>
                  <Link href={localPath(locale, '/services')} className="flex min-h-11 items-center border-b py-2 font-semibold">{portal.allServices}</Link>
                  {categoryOrder.map((category) => <details key={category} className="border-b"><summary className="flex min-h-11 cursor-pointer list-none items-center justify-between py-2 font-semibold [&::-webkit-details-marker]:hidden">{t(categoryCopy[category].title, locale)}<ChevronDown className="size-4" /></summary><div className="pb-3 pl-3">{servicesByCategory(category).slice(0, 7).map((service) => <Link key={service.slug} href={servicePath(locale, service)} className="flex min-h-10 items-center py-1 text-sm text-[#40556A]">{t(service.title, locale)}</Link>)}</div></details>)}
                  {user && <Link href={localPath(locale, '/dashboard')} className="mt-2 flex min-h-11 items-center gap-2 font-semibold text-[#0F766E]"><CircleUserRound className="size-5" />{portal.dashboard}</Link>}
                  {!user && <Button asChild className="mt-4 h-11 w-full bg-[#0F766E] hover:bg-[#0B5F59]"><Link href={demoSignInPath(localPath(locale, '/dashboard'))}>{portal.signIn}<ArrowRight /></Link></Button>}
                </nav>
              </div>
            </details>
          </div>
        </div>

        <div className="hidden border-t lg:block">
          <div className="shell flex min-h-12 items-center justify-between gap-4">
            <nav aria-label="Primary" className="flex h-12 items-stretch">
              <Link href={localPath(locale)} className="flex items-center border-r px-4 text-sm font-semibold hover:bg-[#F6F8FB]">{portal.home}</Link>
              <Link href={localPath(locale, '/services')} className="flex items-center border-r px-4 text-sm font-semibold hover:bg-[#F6F8FB]">{portal.allServices}</Link>
              {(['licence', 'vehicle', 'compliance', 'guides'] as const).map((category) => (
                <details key={category} className="nav-disclosure group relative border-r">
                  <summary className="flex h-full cursor-pointer list-none items-center gap-2 px-4 text-sm font-semibold hover:bg-[#F6F8FB] [&::-webkit-details-marker]:hidden">{t(categoryCopy[category].short, locale)}<ChevronDown className="size-3.5 transition-transform group-open:rotate-180" /></summary>
                  <div className="absolute left-0 top-full w-80 border bg-white p-3 shadow-[0_20px_60px_rgba(16,42,67,.14)]">
                    <p className="px-3 pb-2 text-xs leading-5 text-[#52667A]">{t(categoryCopy[category].description, locale)}</p>
                    {servicesByCategory(category).slice(0, 8).map((service) => <Link key={service.slug} href={servicePath(locale, service)} className="flex min-h-11 items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold hover:bg-[#EDF7F5] hover:text-[#0F766E]">{t(service.title, locale)}<ArrowRight className="size-3.5" /></Link>)}
                  </div>
                </details>
              ))}
            </nav>
            <Link href={localPath(locale, '/services?category=insights')} className="flex min-h-10 items-center gap-2 text-sm font-semibold text-[#52667A] hover:text-[#0F766E]"><Compass className="size-4" />{t(categoryCopy.insights.title, locale)}</Link>
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
      <Button asChild variant="ghost" className="hidden h-11 px-3 md:inline-flex"><Link href={localPath(locale, '/dashboard')}><CircleUserRound />{portal.dashboard}</Link></Button>
      {user.authSource === 'demo' ? (
        <form action="/api/demo-auth/logout" method="post" className="hidden sm:block"><input type="hidden" name="returnTo" value={localPath(locale)} /><Button type="submit" variant="outline" className="h-11 px-4">{portal.signOut}</Button></form>
      ) : (
        <Button asChild variant="outline" className="hidden h-11 px-4 sm:inline-flex"><a href={chatGPTSignOutPath(localPath(locale))}>{portal.signOut}</a></Button>
      )}
    </>
  );
}
