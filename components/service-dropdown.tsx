'use client';

import { ArrowRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { localPath, type Locale } from '@/lib/i18n';
import { categoryCopy, categoryOrder, portalCopy, servicesByCategory, t } from '@/lib/services';
import { cn } from '@/lib/utils';

export function ServiceDropdown({ locale, mobile = false }: { locale: Locale; mobile?: boolean }) {
  const portal = portalCopy[locale];

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={mobile ? 'default' : 'sm'}
          className={cn(
            'group/service-menu font-medium',
            mobile
              ? 'min-h-12 w-full justify-between rounded-none border-b px-0 text-base hover:bg-transparent'
              : 'h-10 rounded-full px-3 text-muted-foreground hover:bg-secondary hover:text-foreground data-[state=open]:bg-secondary data-[state=open]:text-foreground',
          )}
        >
          {portal.allServices}
          <ChevronDown className="size-4 transition-transform duration-200 group-data-[state=open]/service-menu:rotate-180" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={mobile ? 'end' : 'start'}
        sideOffset={mobile ? 8 : 10}
        collisionPadding={mobile ? 12 : 24}
        className={cn(
          'service-directory-menu relative border-foreground/10 bg-white p-2 shadow-[0_28px_80px_rgba(16,42,67,.16)]',
          mobile
            ? 'max-h-[72svh] w-[min(92vw,25rem)] rounded-[1.5rem]'
            : 'max-h-[min(76svh,680px)] w-[min(90vw,62rem)] rounded-[1.75rem] p-3',
        )}
      >
        <div className={cn(mobile ? 'grid gap-1' : 'grid grid-cols-3 gap-x-3 gap-y-4')}>
          {categoryOrder.map((category) => {
            const categoryServices = servicesByCategory(category);
            return (
              <DropdownMenuGroup key={category} className={cn(!mobile && 'rounded-2xl bg-secondary/45 p-2')}>
                <DropdownMenuLabel className="px-2 pb-1 pt-2">
                  <span className="text-[.68rem] font-semibold uppercase tracking-[.12em] text-muted-foreground">
                    {t(categoryCopy[category].short, locale)} · {categoryServices.length}
                  </span>
                </DropdownMenuLabel>
                {categoryServices.map((service) => (
                  <DropdownMenuItem key={service.slug} asChild className="cursor-pointer rounded-xl p-0 focus:bg-civic">
                    <a href={localPath(locale, `/services/${service.slug}`)} className="flex min-h-10 w-full items-center justify-between gap-3 px-2.5 py-2">
                      <span className="min-w-0 text-sm font-medium leading-5">{t(service.title, locale)}</span>
                      <ArrowRight className="size-3.5 shrink-0 text-muted-foreground transition-transform group-focus/dropdown-menu-item:translate-x-0.5" aria-hidden="true" />
                    </a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            );
          })}
        </div>
        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuItem asChild className="cursor-pointer rounded-xl p-0 focus:bg-primary focus:text-primary-foreground">
          <a href={localPath(locale, '/services')} className="flex min-h-11 w-full items-center justify-between px-3 font-semibold">
            {locale === 'hi' ? 'पूरी सेवा निर्देशिका देखें' : 'View the complete service directory'}
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
