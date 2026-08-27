import Link from 'next/link';
import { ArrowDown, ArrowRight, CheckCircle2, CircleDot, FileText, RefreshCw, Route, ShieldCheck } from 'lucide-react';
import { notFound } from 'next/navigation';
import { chatGPTSignInPath, getChatGPTUser } from '@/app/chatgpt-auth';
import { LandingVisual } from '@/components/landing-visual';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { getCopy, isLocale, localPath } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const copy = getCopy(locale);
  const user = await getChatGPTUser();
  const demoHref = user ? localPath(locale, '/dashboard') : chatGPTSignInPath(localPath(locale, '/dashboard'));
  const improvements = [
    [FileText, copy.improvement1Title, copy.improvement1Body],
    [RefreshCw, copy.improvement2Title, copy.improvement2Body],
    [Route, copy.improvement3Title, copy.improvement3Body],
  ] as const;
  const path = [copy.path1, copy.path2, copy.path3, copy.path4, copy.path5];

  return (
    <div lang={locale}>
      <SiteHeader locale={locale} user={user} />
      <main id="main">
        <section className="overflow-hidden border-b bg-[radial-gradient(circle_at_85%_5%,#dcefed_0,transparent_35%),linear-gradient(180deg,#fff_0,#f6f8fb_100%)] py-16 sm:py-24">
          <div className="shell grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(420px,.82fr)]">
            <div className="max-w-2xl">
              <p className="eyebrow">{copy.heroEyebrow}</p>
              <h1 className="mt-4 max-w-4xl text-[clamp(2.7rem,7vw,5.4rem)] font-bold leading-[.95] tracking-[-.035em] text-[#102A43]">{copy.heroTitle}</h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-[#52667A] sm:text-xl">{copy.heroBody}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="h-12 bg-[#0F766E] px-5 text-base hover:bg-[#0B5F59]"><a href={demoHref}>{copy.heroPrimary}<ArrowRight /></a></Button>
                <Button asChild variant="outline" className="h-12 border-[#9FB0C0] bg-white px-5 text-base"><Link href="#how-it-works">{copy.heroSecondary}<ArrowDown /></Link></Button>
              </div>
              <p className="mt-5 flex items-start gap-2 text-sm text-[#52667A]"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#1F7A4C]" aria-hidden="true" />{copy.heroNote}</p>
            </div>
            <LandingVisual copy={copy} />
          </div>
        </section>

        <section id="how-it-works" className="py-16 sm:py-24">
          <div className="shell grid gap-12 lg:grid-cols-[.85fr_1.15fr]">
            <div className="max-w-xl"><p className="eyebrow">{copy.problemEyebrow}</p><h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-5xl">{copy.problemTitle}</h2><p className="mt-6 text-lg text-[#52667A]">{copy.problemBody}</p></div>
            <div className="border-y border-[#B7C4D0]">
              {improvements.map(([Icon, title, body]) => (
                <div key={title} className="grid gap-3 border-b border-[#D8E0E8] py-7 last:border-0 sm:grid-cols-[48px_1fr]">
                  <span className="grid size-10 place-items-center rounded-full bg-[#E8F3F2] text-[#0F766E]"><Icon aria-hidden="true" /></span>
                  <div><h3 className="text-xl font-semibold">{title}</h3><p className="mt-1 max-w-xl text-[#52667A]">{body}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y bg-[#102A43] py-16 text-white sm:py-24">
          <div className="shell"><p className="eyebrow !text-[#F2B36E]">{copy.pathEyebrow}</p><h2 className="mt-3 text-3xl font-semibold sm:text-5xl">{copy.pathTitle}</h2>
            <ol className="mt-10 grid gap-0 lg:grid-cols-5">
              {path.map((item, index) => <li key={item} className="relative border-l border-white/25 py-5 pl-5 lg:border-l-0 lg:border-t lg:pb-0 lg:pl-0 lg:pr-5 lg:pt-7"><span className="absolute -left-2 top-6 grid size-4 place-items-center rounded-full bg-[#F2B36E] text-[#102A43] lg:-top-2 lg:left-0"><CircleDot className="size-3" /></span><span className="text-xs font-semibold tracking-widest text-[#A8C6D8]">0{index + 1}</span><p className="mt-2 font-heading text-lg font-semibold">{item}</p></li>)}
            </ol>
          </div>
        </section>

        <section className="py-16 sm:py-20"><div className="shell grid gap-6 rounded-2xl border border-[#A9D2CD] bg-[#EDF8F6] p-6 sm:grid-cols-[56px_1fr_auto] sm:items-center sm:p-9"><span className="grid size-12 place-items-center rounded-full bg-white text-[#1F7A4C]"><CheckCircle2 aria-hidden="true" /></span><div><h2 className="text-2xl font-semibold">{copy.disclosureTitle}</h2><p className="mt-2 max-w-3xl text-[#52667A]">{copy.disclosureBody}</p></div><Button asChild className="h-11 bg-[#0F766E] px-4 hover:bg-[#0B5F59]"><a href={demoHref}>{copy.heroPrimary}<ArrowRight /></a></Button></div></section>
      </main>
      <footer className="border-t bg-white py-8"><div className="shell flex flex-col gap-2 text-sm text-[#52667A] sm:flex-row sm:items-center sm:justify-between"><p>{copy.footer}</p><p>{copy.prototype}</p></div></footer>
    </div>
  );
}
