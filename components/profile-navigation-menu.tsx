'use client';

import Link from 'next/link';
import { ChevronDown, FileText, Gauge, Languages, LogOut, UserRound } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { chatGPTSignOutPath, type ChatGPTUser } from '@/app/chatgpt-auth';
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
import { accountCopy } from '@/lib/account-copy';
import { localPath, type Locale } from '@/lib/i18n';
import { portalCopy } from '@/lib/services';

export function ProfileNavigationMenu({ locale, user }: { locale: Locale; user: ChatGPTUser }) {
  const pathname = usePathname();
  const account = accountCopy[locale];
  const portal = portalCopy[locale];
  const targetLocale = locale === 'en' ? 'hi' : 'en';
  const segments = pathname.split('/');
  segments[1] = targetLocale;
  const languageHref = segments.join('/') || `/${targetLocale}`;
  const initials = user.displayName.split(/\s+/u).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'RA';
  const firstName = user.displayName.split(/\s+/u).filter(Boolean)[0] || account.profile;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="sm" className="gap-2 px-2 sm:px-3" aria-label={locale === 'hi' ? 'प्रोफ़ाइल नेविगेशन खोलें' : 'Open profile navigation'}>
          <span className="grid size-7 place-items-center rounded-full bg-primary text-[.68rem] font-bold text-primary-foreground" aria-hidden="true">{initials}</span>
          <span className="hidden max-w-24 truncate sm:inline">{firstName}</span>
          <ChevronDown aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={10} className="w-72 rounded-2xl p-2">
        <DropdownMenuLabel className="px-3 py-2">
          <span className="block truncate text-sm font-semibold text-foreground">{user.displayName}</span>
          <span className="mt-0.5 block truncate text-xs font-normal">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="min-h-11 px-3"><Link href={localPath(locale, '/dashboard')}><Gauge />{account.overview}</Link></DropdownMenuItem>
          <DropdownMenuItem asChild className="min-h-11 px-3"><Link href={localPath(locale, '/applications')}><FileText />{account.applications}</Link></DropdownMenuItem>
          <DropdownMenuItem asChild className="min-h-11 px-3"><Link href={localPath(locale, '/profile')}><UserRound />{account.profile}</Link></DropdownMenuItem>
          <DropdownMenuItem asChild className="min-h-11 px-3"><a href={languageHref}><Languages />{targetLocale === 'hi' ? 'हिन्दी' : 'English'}</a></DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {user.authSource === 'demo' ? (
            <form action="/api/demo-auth/logout" method="post">
              <input type="hidden" name="returnTo" value={localPath(locale)} />
              <DropdownMenuItem asChild variant="destructive" className="min-h-11 px-3"><button type="submit" className="w-full"><LogOut />{portal.signOut}</button></DropdownMenuItem>
            </form>
          ) : (
            <DropdownMenuItem asChild variant="destructive" className="min-h-11 px-3"><a href={chatGPTSignOutPath(localPath(locale))}><LogOut />{portal.signOut}</a></DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
