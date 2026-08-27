import Link from 'next/link';
import { ArrowRight, CircleUserRound, ShieldCheck } from 'lucide-react';
import { chatGPTSignInPath, chatGPTSignOutPath, type ChatGPTUser } from '@/app/chatgpt-auth';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Button } from '@/components/ui/button';
import { getCopy, localPath, type Locale } from '@/lib/i18n';

export function SiteHeader({ locale, user }: { locale: Locale; user?: ChatGPTUser | null }) {
  const copy = getCopy(locale);
  return (
    <>
      <a href="#main" className="sr-only z-50 bg-white px-4 py-3 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">{copy.skip}</a>
      <div className="civic-rule" />
      <aside aria-label={copy.prototype} className="border-b bg-[#102A43] text-white">
        <div className="shell flex min-h-10 items-center justify-center gap-2 py-2 text-center text-xs font-medium sm:text-sm">
          <ShieldCheck aria-hidden="true" className="size-4 shrink-0 text-[#F2B36E]" />{copy.prototype}
        </div>
      </aside>
      <header className="border-b bg-white/95 backdrop-blur-sm">
        <div className="shell flex min-h-18 items-center justify-between gap-4 py-3">
          <Link href={localPath(locale)} className="flex items-center gap-3 rounded-md">
            <span className="grid size-10 place-items-center rounded-xl bg-[#E8F3F2] font-heading text-lg font-bold text-[#0F766E]">LR</span>
            <span className="hidden font-heading text-lg font-semibold leading-tight sm:block">{copy.product}</span>
          </Link>
          <nav aria-label="Primary" className="flex items-center gap-1 sm:gap-2">
            <LanguageSwitcher locale={locale} copy={copy} />
            {user ? (
              <>
                <Button asChild variant="ghost" className="hidden h-11 px-3 sm:inline-flex"><Link href={localPath(locale, '/dashboard')}><CircleUserRound />{copy.dashboard}</Link></Button>
                <Button asChild variant="outline" className="h-11 px-4"><a href={chatGPTSignOutPath(localPath(locale))}>{copy.signOut}</a></Button>
              </>
            ) : (
              <Button asChild className="h-11 bg-[#0F766E] px-4 hover:bg-[#0B5F59]"><a href={chatGPTSignInPath(localPath(locale, '/dashboard'))}>{copy.signIn}<ArrowRight /></a></Button>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}
