import Link from 'next/link';
import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { demoSignInPath, type ChatGPTUser } from '@/app/chatgpt-auth';
import { Button } from '@/components/ui/button';
import { footerCopy } from '@/lib/account-copy';
import { localPath, type Locale } from '@/lib/i18n';

const ticker = {
  en: ['Requirements first', 'Bilingual by design', 'Drafts that resume', 'Mock data only', 'Receipts that explain', 'No hidden handoffs'],
  hi: ['पहले आवश्यकताएँ', 'द्विभाषी डिज़ाइन', 'सहेजे गए ड्राफ्ट', 'केवल मॉक डेटा', 'स्पष्ट रसीदें', 'कोई छिपा हस्तांतरण'],
} as const;

export function SiteFooter({ locale, user }: { locale: Locale; user?: ChatGPTUser | null }) {
  const copy = footerCopy[locale];
  const applicationHref = user ? localPath(locale, '/applications') : demoSignInPath(localPath(locale, '/applications'));
  const columns = [
    { title: copy.services, links: [
      [copy.licence, localPath(locale, '/services?category=licence')],
      [copy.vehicle, localPath(locale, '/services?category=vehicle')],
      [copy.compliance, localPath(locale, '/services?category=compliance')],
      [copy.guides, localPath(locale, '/services?category=guides')],
    ] },
    { title: copy.account, links: [
      [copy.applications, applicationHref],
      [copy.profile, user ? localPath(locale, '/profile') : demoSignInPath(localPath(locale, '/profile'))],
      [copy.signIn, demoSignInPath(localPath(locale, '/dashboard'))],
    ] },
    { title: copy.build, links: [
      [copy.brief, 'https://buildwhatmovesindia.com/brief'],
      [copy.disclosure, localPath(locale, '/#trust')],
      [copy.privacy, localPath(locale, '/profile#privacy')],
    ] },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-foreground/8 bg-white">
      <div className="border-b border-foreground/8 bg-secondary/45 py-4" aria-hidden="true">
        <div className="footer-ticker flex w-max gap-10 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[.22em] text-muted-foreground">
          {[...ticker[locale], ...ticker[locale]].map((item, index) => <span key={`${item}-${index}`} className="flex items-center gap-10">{item}<span className="text-foreground/20">✦</span></span>)}
        </div>
      </div>

      <div className="shell relative pb-10 pt-18 sm:pt-24">
        <div className="grid items-end gap-10 border-b border-foreground/8 pb-16 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="eyebrow">{copy.eyebrow}</p>
            <h2 className="mt-5 max-w-4xl text-4xl leading-[1.02] tracking-[-.035em] sm:text-6xl">{copy.title}</h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">{copy.body}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg"><Link href={localPath(locale, '/services')}>{copy.primary}<ArrowUpRight data-icon="inline-end" /></Link></Button>
            <Button asChild variant="outline" size="lg"><Link href={applicationHref}>{copy.secondary}</Link></Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 py-14 md:grid-cols-4">
          <div className="col-span-2 flex flex-col gap-4 md:col-span-1">
            <Link href={localPath(locale)} className="flex w-fit items-center gap-3" aria-label="Raahi home">
              <span className="relative size-4 rounded-full bg-primary after:absolute after:-right-2 after:-top-2 after:size-2 after:rounded-full after:bg-[#8DA5BE]" aria-hidden="true" />
              <span className="font-heading text-2xl font-semibold tracking-[-.035em]">Raahi</span>
            </Link>
            <p className="max-w-[230px] text-sm leading-6 text-muted-foreground">{copy.tagline}</p>
          </div>
          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title} className="flex flex-col gap-4">
              <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-muted-foreground">{column.title}</p>
              <ul className="flex flex-col gap-2.5">
                {column.links.map(([label, href]) => <li key={label}><Link href={href} className="text-sm text-foreground/70 transition-colors hover:text-foreground">{label}</Link></li>)}
              </ul>
            </nav>
          ))}
        </div>

        <div aria-hidden="true" className="pointer-events-none -mx-3 select-none overflow-hidden px-3">
          <p className="bg-gradient-to-b from-foreground/10 to-transparent bg-clip-text font-heading text-[clamp(7rem,20vw,18rem)] font-semibold leading-[.78] tracking-[-.075em] text-transparent">Raahi</p>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-5 border-t border-foreground/8 pt-7 text-center md:flex-row md:text-left">
          <p className="order-2 text-[10px] font-semibold uppercase tracking-[.16em] text-muted-foreground md:order-1">{copy.copyright}</p>
          <div className="order-1 rounded-full border bg-white px-4 py-2 text-[10px] uppercase tracking-[.14em] text-muted-foreground md:order-2">{copy.care} <span className="font-semibold text-foreground">{copy.citizens}</span></div>
          <a href="#top" aria-label={copy.backToTop} className="pressable order-3 grid size-11 place-items-center rounded-full border bg-white text-muted-foreground hover:text-foreground"><ArrowUp className="size-4" /></a>
        </div>
      </div>
    </footer>
  );
}
