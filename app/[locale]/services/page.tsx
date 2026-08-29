import Link from 'next/link';
import { ArrowRight, BookOpenText, CarFront, ChartNoAxesCombined, FileBadge, Gauge, Search, ShieldCheck, X } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { isLocale, localPath } from '@/lib/i18n';
import { categoryCopy, categoryOrder, portalCopy, servicePath, services, t, type ServiceCategory } from '@/lib/services';

export const dynamic = 'force-dynamic';

const icons = { licence: FileBadge, vehicle: CarFront, compliance: ShieldCheck, industry: Gauge, insights: ChartNoAxesCombined, guides: BookOpenText } as const;

export default async function ServicesPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ q?: string; category?: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const portal = portalCopy[locale];
  const query = await searchParams;
  const search = (query.q || '').trim().toLocaleLowerCase(locale === 'hi' ? 'hi-IN' : 'en-IN');
  const selectedCategory = categoryOrder.includes(query.category as ServiceCategory) ? query.category as ServiceCategory : null;
  const visible = services.filter((service) => {
    if (selectedCategory && service.category !== selectedCategory) return false;
    if (!search) return true;
    return `${t(service.title, locale)} ${t(service.summary, locale)} ${t(categoryCopy[service.category].title, locale)}`.toLocaleLowerCase(locale === 'hi' ? 'hi-IN' : 'en-IN').includes(search);
  });
  const groups = categoryOrder.filter((category) => visible.some((service) => service.category === category));
  const user = await getChatGPTUser();

  return (
    <div lang={locale} className="civic-paper">
      <SiteHeader locale={locale} user={user} />
      <main id="main">
        <section className="border-b border-foreground/8 bg-white/64 py-14 sm:py-20">
          <div className="shell grid gap-8 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
            <div><p className="eyebrow">{portal.directoryEyebrow}</p><h1 className="mt-4 text-5xl leading-[.96] tracking-[-.035em] sm:text-7xl">{portal.directoryTitle}</h1><p className="mt-5 max-w-xl text-lg text-muted-foreground">{portal.directoryBody}</p></div>
            <form action={localPath(locale, '/services')} className="lg:justify-self-end lg:w-full lg:max-w-2xl" role="search" aria-label={locale === 'hi' ? 'निर्देशिका खोज' : 'Directory search'}>
              <label htmlFor="directory-search" className="font-semibold">{portal.search}</label>
              <div className="ios-panel mt-2 flex items-center p-2 focus-within:ring-3 focus-within:ring-ring/25"><Search className="ml-2 size-5 shrink-0 text-muted-foreground" /><input id="directory-search" name="q" type="search" defaultValue={query.q} placeholder={portal.searchPlaceholder} className="h-12 min-w-0 flex-1 bg-transparent px-3 outline-none" /><Button type="submit">{portal.searchAction}</Button></div>
            </form>
          </div>
        </section>

        <div className="ios-glass sticky top-16 z-20 border-b border-foreground/8">
          <nav aria-label="Service categories" className="shell flex gap-2 overflow-x-auto py-3">
            <Button asChild variant={!selectedCategory ? 'default' : 'outline'} size="sm" className="shrink-0"><Link href={search ? localPath(locale, `/services?q=${encodeURIComponent(query.q || '')}`) : localPath(locale, '/services')}>{portal.allServices}</Link></Button>
            {categoryOrder.map((category) => <Button key={category} asChild variant={selectedCategory === category ? 'default' : 'outline'} size="sm" className="shrink-0"><Link href={localPath(locale, `/services?category=${category}${search ? `&q=${encodeURIComponent(query.q || '')}` : ''}`)}>{t(categoryCopy[category].short, locale)}</Link></Button>)}
          </nav>
        </div>

        <section className="py-12 sm:py-16">
          <div className="shell">
            {(search || selectedCategory) && <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-muted-foreground"><span>{visible.length} {portal.servicesCount}</span>{search && <span className="rounded-full border bg-white px-3 py-1 font-semibold">“{query.q}”</span>}<Link href={localPath(locale, '/services')} className="inline-flex min-h-10 items-center gap-2 font-semibold text-foreground"><X className="size-4" />{portal.clear}</Link></div>}
            {groups.length === 0 ? <div className="ios-panel py-16 text-center"><Search className="mx-auto size-9 text-muted-foreground" /><h2 className="mt-4 text-2xl">{portal.noResults}</h2><Button asChild variant="outline" className="mt-6"><Link href={localPath(locale, '/services')}>{portal.clear}</Link></Button></div> : (
              <div className="flex flex-col gap-16">
                {groups.map((category) => {
                  const Icon = icons[category];
                  const items = visible.filter((service) => service.category === category);
                  return <section key={category} aria-labelledby={`directory-${category}`}><div className="grid gap-5 border-b border-foreground pb-5 md:grid-cols-[1fr_1fr] md:items-end"><div className="flex items-center gap-4"><span className="text-sm font-semibold text-muted-foreground">0{categoryOrder.indexOf(category) + 1}</span><span className="grid size-10 place-items-center rounded-full bg-white"><Icon className="size-4" /></span><h2 id={`directory-${category}`} className="text-3xl sm:text-4xl">{t(categoryCopy[category].title, locale)}</h2></div><p className="max-w-2xl text-muted-foreground md:justify-self-end">{t(categoryCopy[category].description, locale)}</p></div><div className="mt-4 grid gap-3 md:grid-cols-2">{items.map((service) => <article key={service.slug} className="ios-panel panel-hover group relative grid min-h-44 grid-cols-[1fr_auto] gap-5 p-6"><div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{service.mode === 'transaction' ? portal.servicePrototype : t(service.duration, locale)}</p><h3 className="mt-2 text-xl"><Link href={servicePath(locale, service)} className="after:absolute after:inset-0">{t(service.title, locale)}</Link></h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{t(service.summary, locale)}</p></div><span className="grid size-10 place-items-center rounded-full bg-secondary transition-transform group-hover:translate-x-1"><ArrowRight className="size-4" /></span></article>)}</div></section>;
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <footer className="border-t bg-white/72 py-8"><div className="shell flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:justify-between"><p>{portal.footerLine}</p><p>{portal.prototype}</p></div></footer>
    </div>
  );
}
