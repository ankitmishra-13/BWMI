'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity, BellRing, Bot, FileStack, LayoutDashboard, LogOut, MapPinned,
  Route, ScrollText, Settings2, ShieldCheck, UsersRound,
} from 'lucide-react';
import { adminRoleLabel, type AdminSession } from '@/app/admin-auth';
import { AdminAssistant } from '@/components/admin-assistant';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarProvider, SidebarRail, SidebarSeparator, SidebarTrigger,
} from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const navigation = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Applications', href: '/admin/applications', icon: FileStack },
  { label: 'Regions', href: '/admin/regions', icon: MapPinned },
  { label: 'Citizens', href: '/admin/citizens', icon: UsersRound },
  { label: 'Notifications', href: '/admin/notifications', icon: BellRing },
  { label: 'Ops Copilot', href: '/admin/assistant', icon: Bot },
  { label: 'Audit trail', href: '/admin/audit', icon: ScrollText },
  { label: 'Settings', href: '/admin/settings', icon: Settings2 },
] as const;

export function AdminShell({ children, admin, applicationId }: { children: React.ReactNode; admin: AdminSession; applicationId?: string; active?: string }) {
  const pathname = usePathname();
  return (
    <TooltipProvider>
      <SidebarProvider className="admin-surface" style={{ '--sidebar-width': '16rem', '--sidebar-width-icon': '4.5rem' } as React.CSSProperties}>
        <Sidebar collapsible="icon" className="admin-sidebar">
          <SidebarHeader className="border-b border-sidebar-border p-3">
            <Link href="/admin" className="flex h-11 items-center gap-3 rounded-lg px-2 focus-visible:ring-2 focus-visible:ring-sidebar-ring">
              <span className="relative size-3 shrink-0 rounded-full bg-sidebar-foreground after:absolute after:-right-1.5 after:-top-1.5 after:size-1.5 after:rounded-full after:bg-[#CDBB9F]" />
              <span className="min-w-0 overflow-hidden whitespace-nowrap">
                <span className="block text-base font-semibold leading-none">Raahi</span>
                <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[.14em] text-sidebar-foreground/55">Operations</span>
              </span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Workspace</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigation.slice(0, 6).map(({ label, href, icon: Icon }) => {
                    const current = href === '/admin' ? pathname === href : pathname.startsWith(href);
                    return <SidebarMenuItem key={href}><SidebarMenuButton asChild isActive={current} tooltip={label} size="lg"><Link href={href}><Icon /><span>{label}</span></Link></SidebarMenuButton></SidebarMenuItem>;
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Governance</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigation.slice(6).map(({ label, href, icon: Icon }) => {
                    const current = pathname.startsWith(href);
                    return <SidebarMenuItem key={href}><SidebarMenuButton asChild isActive={current} tooltip={label}><Link href={href}><Icon /><span>{label}</span></Link></SidebarMenuButton></SidebarMenuItem>;
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t border-sidebar-border p-3">
            <div data-collapsible-label className="overflow-hidden rounded-lg bg-sidebar-accent p-3">
              <p className="flex items-center gap-2 text-xs font-semibold"><ShieldCheck className="size-4" />Synthetic environment</p>
              <p className="mt-1 text-[11px] leading-5 text-sidebar-foreground/58">No live government, DigiLocker, or WhatsApp connection.</p>
            </div>
            <SidebarMenu>
              <SidebarMenuItem><SidebarMenuButton asChild tooltip="Citizen site"><Link href="/en"><Route /><span>Citizen site</span></Link></SidebarMenuButton></SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset className="min-w-0">
          <header className="sticky top-0 z-20 flex min-h-16 items-center gap-3 border-b bg-card/95 px-4 backdrop-blur-xl sm:px-6">
            <SidebarTrigger aria-label="Collapse or expand navigation" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{admin.name}</p>
              <p className="truncate text-xs text-muted-foreground">{adminRoleLabel(admin.role)}{admin.regionCode ? ` · ${admin.regionCode}` : ' · All India'}</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Badge variant="outline" className="hidden sm:inline-flex"><Activity className="text-success" />Simulated systems</Badge>
              <AdminAssistant admin={admin} applicationId={applicationId} triggerOnly />
              <form action="/api/admin/logout" method="post"><Button type="submit" variant="ghost" size="icon-sm" aria-label="Sign out of admin"><LogOut /></Button></form>
            </div>
          </header>
          <div className={cn('min-w-0 flex-1 p-4 sm:p-6 lg:p-8', pathname === '/admin/assistant' && 'p-0 sm:p-0 lg:p-0')}>
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
