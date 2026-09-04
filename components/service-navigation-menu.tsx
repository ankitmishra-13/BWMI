'use client';

import Link from 'next/link';
import { ArrowRight, BookOpenText, CarFront, ChartNoAxesCombined, FileBadge, Gauge, ShieldCheck } from 'lucide-react';
import { useSyncExternalStore } from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { localPath, type Locale } from '@/lib/i18n';
import { categoryCopy, portalCopy, servicesByCategory, t, type ServiceCategory } from '@/lib/services';
import { cn } from '@/lib/utils';

const catalogueColumns: ServiceCategory[][] = [
  ['licence', 'industry'],
  ['vehicle', 'insights'],
  ['compliance', 'guides'],
];

const categoryIcons = {
  licence: FileBadge,
  vehicle: CarFront,
  compliance: ShieldCheck,
  industry: Gauge,
  insights: ChartNoAxesCombined,
  guides: BookOpenText,
} as const;

const featuredCategories: ServiceCategory[] = ['licence', 'vehicle', 'compliance'];
const subscribe = () => () => undefined;

export function ServiceNavigationMenu({ locale }: { locale: Locale }) {
  const portal = portalCopy[locale];
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);

  if (!hydrated) {
    return (
      <div className="flex items-center gap-0.5" aria-label={locale === 'hi' ? 'मुख्य' : 'Main'}>
        <Link href={localPath(locale)} className="inline-flex h-10 items-center rounded-full px-3 text-sm font-medium text-muted-foreground">{portal.home}</Link>
        <Link href={localPath(locale, '/services')} className="inline-flex h-10 items-center rounded-full px-3.5 text-sm font-medium text-muted-foreground">{portal.allServices}</Link>
        {featuredCategories.map((category) => <Link key={category} href={localPath(locale, `/services?category=${category}`)} className="inline-flex h-10 items-center rounded-full px-3 text-sm font-medium text-muted-foreground">{t(categoryCopy[category].short, locale)}</Link>)}
        <Link href={localPath(locale, '/services?category=guides')} className="inline-flex h-10 items-center rounded-full px-3 text-sm font-medium text-muted-foreground">{t(categoryCopy.guides.short, locale)}</Link>
      </div>
    );
  }

  return (
    <NavigationMenu delayDuration={80} skipDelayDuration={240} className="max-w-none">
      <NavigationMenuList className="gap-0.5">
        <DirectNavigationLink href={localPath(locale)} label={portal.home} />

        <NavigationMenuItem>
          <NavigationMenuTrigger className="h-10 rounded-full px-3.5 text-muted-foreground hover:text-foreground">
            {portal.allServices}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="service-navigation-panel max-h-[min(72svh,640px)] w-[min(75vw,930px)] overflow-y-auto p-5">
              <div className="flex items-end justify-between gap-6 border-b pb-4">
                <div>
                  <p className="eyebrow">{locale === 'hi' ? 'पूर्ण निर्देशिका' : 'Complete directory'}</p>
                  <p className="mt-1 font-heading text-2xl">{locale === 'hi' ? 'अपना काम सीधे चुनें' : 'Choose the task directly'}</p>
                </div>
                <NavigationMenuLink asChild className="shrink-0 rounded-full px-3 py-2 font-semibold">
                  <Link href={localPath(locale, '/services')}>{portal.allServices}<ArrowRight data-icon="inline-end" /></Link>
                </NavigationMenuLink>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-x-7">
                {catalogueColumns.map((column, columnIndex) => (
                  <div key={columnIndex} className="flex flex-col gap-6">
                    {column.map((category) => <CatalogueGroup key={category} locale={locale} category={category} />)}
                  </div>
                ))}
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {featuredCategories.map((category) => <CategoryNavigationItem key={category} locale={locale} category={category} />)}

        <DirectNavigationLink href={localPath(locale, '/services?category=guides')} label={t(categoryCopy.guides.short, locale)} />
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function DirectNavigationLink({ href, label }: { href: string; label: string }) {
  return (
    <NavigationMenuItem>
      <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), 'h-10 rounded-full px-3 text-muted-foreground hover:text-foreground')}>
        <Link href={href}>{label}</Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}

function CatalogueGroup({ locale, category }: { locale: Locale; category: ServiceCategory }) {
  const Icon = categoryIcons[category];
  const services = servicesByCategory(category);
  return (
    <section aria-labelledby={`header-menu-${category}`} className="border-t pt-3">
      <div className="mb-1 flex items-center gap-2 px-2">
        <Icon aria-hidden="true" />
        <h2 id={`header-menu-${category}`} className="font-sans text-[.68rem] font-semibold uppercase tracking-[.12em] text-muted-foreground">
          {t(categoryCopy[category].short, locale)} · {services.length}
        </h2>
      </div>
      <div className="grid gap-0.5">
        {services.map((service) => (
          <NavigationMenuLink key={service.slug} asChild className="group min-h-9 justify-between rounded-xl px-2 py-1.5 font-medium">
            <Link href={localPath(locale, `/services/${service.slug}`)}>
              <span className="min-w-0 leading-5">{t(service.title, locale)}</span>
              <ArrowRight aria-hidden="true" />
            </Link>
          </NavigationMenuLink>
        ))}
      </div>
    </section>
  );
}

function CategoryNavigationItem({ locale, category }: { locale: Locale; category: ServiceCategory }) {
  const Icon = categoryIcons[category];
  const services = servicesByCategory(category);
  const copy = categoryCopy[category];
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="h-10 rounded-full px-3 text-muted-foreground hover:text-foreground">
        {t(copy.short, locale)}
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="service-navigation-panel grid w-[min(70vw,690px)] grid-cols-[220px_minmax(0,1fr)] gap-5 p-5">
          <div className="route-texture flex min-h-72 flex-col justify-between rounded-[1.35rem] p-5 text-white">
            <div>
              <span className="grid size-10 place-items-center rounded-full bg-white/12"><Icon aria-hidden="true" /></span>
              <p className="mt-5 font-heading text-2xl leading-tight">{t(copy.title, locale)}</p>
              <p className="mt-3 text-sm leading-6 text-white/65">{t(copy.description, locale)}</p>
            </div>
            <NavigationMenuLink asChild className="mt-6 justify-between rounded-full bg-white px-3 py-2 font-semibold text-primary hover:bg-white/90 hover:text-primary">
              <Link href={localPath(locale, `/services?category=${category}`)}>
                {locale === 'hi' ? 'पूरी श्रेणी देखें' : 'View full category'}<ArrowRight data-icon="inline-end" />
              </Link>
            </NavigationMenuLink>
          </div>
          <div className="grid content-start grid-cols-2 gap-1">
            {services.map((service) => (
              <NavigationMenuLink key={service.slug} asChild className="group min-h-14 items-start justify-between rounded-xl px-3 py-2.5 font-medium">
                <Link href={localPath(locale, `/services/${service.slug}`)}>
                  <span className="min-w-0 leading-5">{t(service.title, locale)}</span>
                  <ArrowRight aria-hidden="true" />
                </Link>
              </NavigationMenuLink>
            ))}
          </div>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
