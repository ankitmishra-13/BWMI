import Link from 'next/link';
import { ArrowDownRight, ArrowRight, BookOpenText, CarFront, ChartNoAxesCombined, FileBadge, Gauge, Search, ShieldCheck } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { LandingVisual } from '@/components/landing-visual';
import { JourneyPreview } from '@/components/journey-preview';
import { SectionRail } from '@/components/section-rail';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { getCopy, isLocale, localPath } from '@/lib/i18n';
import { categoryCopy, categoryOrder, getService, portalCopy, servicePath, services, servicesByCategory, t } from '@/lib/services';

export const dynamic = 'force-dynamic';

const categoryIcons = { licence: FileBadge, vehicle: CarFront, compliance: ShieldCheck, industry: Gauge, insights: ChartNoAxesCombined, guides: BookOpenText } as const;

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const portal = portalCopy[locale];
  const copy = getCopy(locale);
  const user = await getChatGPTUser();
  const popular = services.filter((service) => service.popular).slice(0, 6);
  const renewal = getService('renew-driving-licence')!;
  return (
    <div lang={locale} className="civic-paper">
      <SiteHeader locale={locale} user={user} />
      <main id="main" className="overflow-x-clip">
        <div className="shell grid md:grid-cols-[168px_minmax(0,1fr)] md:gap-10 lg:grid-cols-[190px_minmax(0,1fr)] lg:gap-14">
          <SectionRail locale={locale} user={user} />

          <div className="min-w-0">
            <section id="find-service" className="scroll-mt-24 py-16 sm:py-20 lg:grid lg:min-h-[680px] lg:grid-cols-[minmax(0,1fr)_390px] lg:items-center lg:gap-10 lg:py-12">
              <div className="min-w-0">
                <p className="eyebrow reveal">{portal.heroEyebrow}</p>
                <h1 className="reveal reveal-delay-1 mt-5 max-w-[850px] text-[clamp(3.35rem,5.8vw,6.2rem)] leading-[.92] tracking-[-.052em]">{portal.heroTitle}</h1>
                <p className="reveal reveal-delay-2 mt-7 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">{portal.heroBody}</p>

                <form action={localPath(locale, '/services')} className="ios-panel mt-9 max-w-2xl p-2" role="search" aria-label={locale === 'hi' ? 'मुख्य सेवा खोज' : 'Main service search'}>
                  <label htmlFor="service-search" className="sr-only">{portal.search}</label>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="flex min-w-0 flex-1 items-center px-3">
                      <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                      <input id="service-search" name="q" type="search" placeholder={portal.searchPlaceholder} className="h-12 min-w-0 flex-1 bg-transparent px-3 text-base outline-none placeholder:text-muted-foreground" />
                    </div>
                    <Button type="submit" size="lg">{portal.searchAction}<ArrowRight data-icon="inline-end" /></Button>
                  </div>
                </form>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg"><Link href={localPath(locale, '/services')}>{portal.heroPrimary}<ArrowDownRight data-icon="inline-end" /></Link></Button>
                  <Button asChild variant="secondary" size="lg"><Link href={servicePath(locale, renewal)}>{portal.heroSecondary}<ArrowRight data-icon="inline-end" /></Link></Button>
                </div>
                <p className="mt-6 flex max-w-xl items-start gap-2 text-sm text-muted-foreground"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />{portal.heroNote}</p>
              </div>
              <div className="mt-12 lg:mt-0"><LandingVisual copy={copy} /></div>
            </section>

            <section id="popular" className="scroll-mt-24 py-20 sm:py-28">
              <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
                <div><p className="eyebrow">{portal.popularEyebrow}</p><h2 className="mt-4 text-4xl leading-[1.02] tracking-[-.03em] sm:text-5xl">{portal.popularTitle}</h2></div>
                <p className="max-w-xl text-muted-foreground lg:justify-self-end">{portal.popularBody}</p>
              </div>
              <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {popular.map((service, index) => {
                  const Icon = categoryIcons[service.category];
                  return (
                    <article key={service.slug} className="ios-panel panel-hover group relative min-h-56 p-6">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground">0{index + 1}</span>
                        <span className="grid size-10 place-items-center rounded-full bg-secondary"><Icon className="size-4" aria-hidden="true" /></span>
                      </div>
                      <h3 className="mt-8 text-2xl leading-tight"><Link href={servicePath(locale, service)} className="after:absolute after:inset-0">{t(service.title, locale)}</Link></h3>
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{t(service.summary, locale)}</p>
                      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">{portal.viewService}<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span>
                    </article>
                  );
                })}
              </div>
            </section>

            <section id="service-index" className="scroll-mt-24 py-20 sm:py-28">
              <div className="max-w-3xl"><p className="eyebrow">{portal.indexEyebrow}</p><h2 className="mt-4 text-4xl leading-[1.02] tracking-[-.03em] sm:text-6xl">{portal.indexTitle}</h2></div>
              <div className="mt-12 grid gap-x-12 gap-y-14 lg:grid-cols-2">
                {categoryOrder.map((category, categoryIndex) => {
                  const Icon = categoryIcons[category];
                  const items = servicesByCategory(category);
                  return (
                    <section key={category} aria-labelledby={`category-${category}`} className="border-t border-foreground pt-5">
                      <div className="flex items-start gap-4">
                        <span className="text-sm font-semibold text-muted-foreground">0{categoryIndex + 1}</span>
                        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white"><Icon className="size-4" aria-hidden="true" /></span>
                        <div><h3 id={`category-${category}`} className="text-2xl">{t(categoryCopy[category].title, locale)}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{t(categoryCopy[category].description, locale)}</p></div>
                      </div>
                      <ul className="mt-6 border-y">
                        {items.slice(0, 5).map((service) => <li key={service.slug} className="border-b last:border-0"><Link href={servicePath(locale, service)} className="group flex min-h-12 items-center justify-between gap-4 py-2 text-sm font-medium">{t(service.title, locale)}<ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" /></Link></li>)}
                      </ul>
                      <Button asChild variant="ghost" className="mt-4 px-0"><Link href={localPath(locale, `/services?category=${category}`)}>{portal.viewCategory} · {items.length}<ArrowRight data-icon="inline-end" /></Link></Button>
                    </section>
                  );
                })}
              </div>
            </section>

            <div className="pb-20 sm:pb-28"><JourneyPreview locale={locale} service={renewal} /></div>
          </div>
        </div>

        <section id="renewal-path" className="scroll-mt-24 bg-primary py-18 text-primary-foreground sm:py-24">
          <div className="shell grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
            <div><p className="text-xs font-semibold uppercase tracking-[.14em] text-white/55">{portal.renewalEyebrow}</p><h2 className="mt-5 text-4xl leading-[.98] tracking-[-.03em] sm:text-6xl">{portal.renewalTitle}</h2><p className="mt-6 max-w-2xl text-lg leading-8 text-white/62">{portal.renewalBody}</p><Button asChild variant="secondary" size="lg" className="mt-8"><Link href={servicePath(locale, renewal)}>{portal.renewalCta}<ArrowRight data-icon="inline-end" /></Link></Button></div>
            <div className="rounded-[2rem] border border-white/14 bg-white/6 p-3 backdrop-blur-sm">
              {[portal.step1, portal.step2, portal.step3, portal.step4].map((step, index) => (
                <div key={step} className="grid grid-cols-[46px_1fr_auto] items-center gap-4 border-b border-white/12 px-3 py-5 last:border-0 sm:px-5">
                  <span className="text-sm font-semibold text-white/65">0{index + 1}</span><span className="text-lg font-medium">{step}</span><span className={`size-2.5 rounded-full ${index === 3 ? 'bg-white' : 'bg-white/45'}`} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="trust" className="scroll-mt-28 py-16 sm:py-24">
          <div className="shell">
            <div className="ios-panel grid gap-6 p-7 sm:grid-cols-[52px_1fr] sm:p-10">
              <span className="grid size-12 place-items-center rounded-full bg-secondary"><ShieldCheck className="size-5" aria-hidden="true" /></span>
              <div><h2 className="text-2xl sm:text-3xl">{portal.trustTitle}</h2><p className="mt-3 max-w-4xl text-muted-foreground">{portal.trustBody}</p></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
