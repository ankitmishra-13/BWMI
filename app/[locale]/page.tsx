import Link from 'next/link';
import { ArrowDownRight, ArrowRight, BookOpenText, CarFront, ChartNoAxesCombined, FileBadge, Gauge, Search, ShieldCheck, Sparkles } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { isLocale, localPath } from '@/lib/i18n';
import { categoryCopy, categoryOrder, getService, portalCopy, servicePath, services, servicesByCategory, t, type ServiceCategory } from '@/lib/services';

export const dynamic = 'force-dynamic';

const categoryIcons = { licence: FileBadge, vehicle: CarFront, compliance: ShieldCheck, industry: Gauge, insights: ChartNoAxesCombined, guides: BookOpenText } as const;

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const portal = portalCopy[locale];
  const user = await getChatGPTUser();
  const popular = services.filter((service) => service.popular).slice(0, 6);
  const renewal = getService('renew-driving-licence')!;
  const heroIndex: ServiceCategory[] = ['licence', 'vehicle', 'compliance', 'guides'];

  return (
    <div lang={locale}>
      <SiteHeader locale={locale} user={user} />
      <main id="main">
        <section className="overflow-hidden border-b bg-[linear-gradient(115deg,#fff_0%,#fff_58%,#eef6f5_58%,#eef6f5_100%)]">
          <div className="shell grid min-h-[650px] items-stretch lg:grid-cols-[minmax(0,1.18fr)_minmax(360px,.62fr)]">
            <div className="flex max-w-3xl flex-col justify-center py-16 pr-0 sm:py-24 lg:pr-16">
              <p className="eyebrow">{portal.heroEyebrow}</p>
              <h1 className="mt-4 text-[clamp(3rem,7.2vw,6.6rem)] font-bold leading-[.88] tracking-[-.055em] text-[#102A43]">{portal.heroTitle}</h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-[#52667A] sm:text-xl">{portal.heroBody}</p>
              <form action={localPath(locale, '/services')} className="mt-9 max-w-2xl" role="search" aria-label={locale === 'hi' ? 'मुख्य सेवा खोज' : 'Main service search'}>
                <label htmlFor="service-search" className="font-heading text-lg font-semibold">{portal.search}</label>
                <div className="mt-2 flex flex-col gap-2 rounded-2xl border border-[#9FB0C0] bg-white p-2 shadow-[0_16px_40px_rgba(16,42,67,.08)] sm:flex-row">
                  <div className="flex min-w-0 flex-1 items-center px-3"><Search className="size-5 shrink-0 text-[#52667A]" aria-hidden="true" /><input id="service-search" name="q" type="search" placeholder={portal.searchPlaceholder} className="h-12 min-w-0 flex-1 bg-transparent px-3 text-base outline-none placeholder:text-[#71869A]" /></div>
                  <Button type="submit" className="h-12 bg-[#0F766E] px-6 text-base hover:bg-[#0B5F59]">{portal.searchAction}<ArrowRight /></Button>
                </div>
              </form>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="outline" className="h-12 border-[#9FB0C0] bg-white px-5 text-base"><Link href={localPath(locale, '/services')}>{portal.heroPrimary}<ArrowDownRight /></Link></Button>
                <Button asChild variant="ghost" className="h-12 justify-start px-3 text-base text-[#0F766E]"><Link href={servicePath(locale, renewal)}>{portal.heroSecondary}<ArrowRight /></Link></Button>
              </div>
              <p className="mt-6 flex items-start gap-2 text-sm text-[#52667A]"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#1F7A4C]" aria-hidden="true" />{portal.heroNote}</p>
            </div>

            <aside className="relative border-t border-[#AFCAC7] py-10 lg:border-l lg:border-t-0 lg:py-16 lg:pl-10">
              <div className="absolute bottom-0 left-0 top-0 hidden w-px bg-[#AFCAC7] lg:block" />
              <p className="text-xs font-bold uppercase tracking-[.15em] text-[#52667A]">{portal.allServices}</p>
              <ol className="mt-6 border-y border-[#9FB0C0]">
                {heroIndex.map((category, index) => {
                  const Icon = categoryIcons[category];
                  return <li key={category} className="group border-b border-[#B8C5D3] last:border-0"><Link href={localPath(locale, `/services?category=${category}`)} className="grid min-h-28 grid-cols-[50px_1fr_auto] items-center gap-3 py-5"><span className="font-heading text-xl font-semibold text-[#C76A15]">0{index + 1}</span><span><span className="block text-lg font-semibold group-hover:text-[#0F766E]">{t(categoryCopy[category].title, locale)}</span><span className="mt-1 block text-sm text-[#52667A]">{servicesByCategory(category).length} {portal.servicesCount}</span></span><Icon className="size-5 text-[#0F766E] transition-transform group-hover:translate-x-1" /></Link></li>;
                })}
              </ol>
              <div className="mt-8 border-l-4 border-[#C76A15] pl-5"><p className="font-heading text-xl font-semibold">{portal.trustTitle}</p></div>
            </aside>
          </div>
        </section>

        <section className="py-16 sm:py-24">
          <div className="shell">
            <div className="grid gap-6 lg:grid-cols-[.7fr_1.3fr] lg:items-end">
              <div><p className="eyebrow">{portal.popularEyebrow}</p><h2 className="mt-3 text-4xl font-semibold leading-[1.02] sm:text-5xl">{portal.popularTitle}</h2></div>
              <p className="max-w-2xl text-lg text-[#52667A] lg:justify-self-end">{portal.popularBody}</p>
            </div>
            <div className="mt-10 grid border-y md:grid-cols-2 lg:grid-cols-3">
              {popular.map((service, index) => {
                const Icon = categoryIcons[service.category];
                return <article key={service.slug} className="group relative border-b p-6 md:border-r lg:min-h-60 lg:p-7 [&:nth-last-child(-n+3)]:lg:border-b-0 [&:nth-child(2n)]:md:border-r-0 [&:nth-child(3n)]:lg:border-r-0 [&:nth-child(3n+1)]:lg:border-r"><div className="flex items-center justify-between"><span className="font-heading text-sm font-semibold text-[#934C0C]">0{index + 1}</span><Icon className="size-5 text-[#0F766E]" /></div><h3 className="mt-8 text-2xl font-semibold leading-tight"><Link href={servicePath(locale, service)} className="after:absolute after:inset-0">{t(service.title, locale)}</Link></h3><p className="mt-3 text-sm leading-6 text-[#52667A]">{t(service.summary, locale)}</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#0F766E]">{portal.viewService}<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span></article>;
              })}
            </div>
          </div>
        </section>

        <section className="border-y bg-white py-16 sm:py-24">
          <div className="shell">
            <div className="max-w-3xl"><p className="eyebrow">{portal.indexEyebrow}</p><h2 className="mt-3 text-4xl font-semibold leading-[1.02] sm:text-6xl">{portal.indexTitle}</h2></div>
            <div className="mt-12 grid gap-x-12 gap-y-14 lg:grid-cols-2">
              {categoryOrder.map((category, categoryIndex) => {
                const Icon = categoryIcons[category];
                const items = servicesByCategory(category);
                return <section key={category} aria-labelledby={`category-${category}`} className="border-t-2 border-[#102A43] pt-5"><div className="flex items-start gap-4"><span className="font-heading text-2xl font-semibold text-[#C76A15]">0{categoryIndex + 1}</span><Icon className="mt-1 size-6 text-[#0F766E]" /><div><h3 id={`category-${category}`} className="text-2xl font-semibold">{t(categoryCopy[category].title, locale)}</h3><p className="mt-2 text-sm leading-6 text-[#52667A]">{t(categoryCopy[category].description, locale)}</p></div></div><ul className="mt-6 border-y">{items.slice(0, 5).map((service) => <li key={service.slug} className="border-b last:border-0"><Link href={servicePath(locale, service)} className="flex min-h-12 items-center justify-between gap-4 py-2 text-sm font-semibold hover:text-[#0F766E]">{t(service.title, locale)}<ArrowRight className="size-4 shrink-0" /></Link></li>)}</ul><Link href={localPath(locale, `/services?category=${category}`)} className="mt-4 inline-flex min-h-11 items-center gap-2 font-semibold text-[#0F766E]">{portal.viewCategory} · {items.length}<ArrowRight className="size-4" /></Link></section>;
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#102A43] py-16 text-white sm:py-24">
          <div className="shell grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
            <div><p className="eyebrow !text-[#F2B36E]">{portal.renewalEyebrow}</p><h2 className="mt-4 text-4xl font-semibold leading-[.98] sm:text-6xl">{portal.renewalTitle}</h2><p className="mt-6 max-w-2xl text-lg leading-8 text-[#C2D3DF]">{portal.renewalBody}</p><Button asChild className="mt-8 h-12 bg-white px-5 text-base text-[#102A43] hover:bg-[#E8F3F2]"><Link href={servicePath(locale, renewal)}>{portal.renewalCta}<ArrowRight /></Link></Button></div>
            <div className="relative border-y border-white/30 py-2">
              {[portal.step1, portal.step2, portal.step3, portal.step4].map((step, index) => <div key={step} className="grid grid-cols-[54px_1fr_auto] items-center gap-4 border-b border-white/20 py-6 last:border-0"><span className="font-heading text-2xl font-semibold text-[#F2B36E]">0{index + 1}</span><span className="text-xl font-semibold">{step}</span><span className={`size-3 rounded-full ${index === 3 ? 'bg-[#F2B36E]' : 'bg-[#3EA59C]'}`} /></div>)}
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-20"><div className="shell grid gap-6 border-l-4 border-[#C76A15] bg-[#EDF8F6] p-7 sm:grid-cols-[56px_1fr] sm:p-10"><span className="grid size-12 place-items-center rounded-full bg-white text-[#0F766E]"><Sparkles /></span><div><h2 className="text-2xl font-semibold sm:text-3xl">{portal.trustTitle}</h2><p className="mt-3 max-w-4xl text-[#52667A]">{portal.trustBody}</p></div></div></section>
      </main>

      <footer className="border-t bg-white py-10">
        <div className="shell grid gap-8 sm:grid-cols-[1fr_auto] sm:items-end"><div><p className="font-heading text-2xl font-bold">{portal.brand}</p><p className="mt-2 max-w-xl text-sm text-[#52667A]">{portal.prototype}</p><p className="mt-4 text-xs text-[#52667A]">{portal.footerLine}</p></div><nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold"><Link href={localPath(locale, '/services')}>{portal.allServices}</Link><Link href={servicePath(locale, renewal)}>{portal.heroSecondary}</Link><Link href={localPath(locale, '/login')}>{portal.signIn}</Link></nav></div>
      </footer>
    </div>
  );
}
