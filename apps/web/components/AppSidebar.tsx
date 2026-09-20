'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  Image as ImageIcon,
  FileText,
  Settings,
  Code2,
} from 'lucide-react';
import { Logo } from './Logo';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  tabKey?: string;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    label: 'Profile',
    href: '/profile?tab=general',
    icon: <User className="h-4 w-4" />,
    tabKey: 'general',
  },
  // {
  //   label: 'Media',
  //   href: '/profile?tab=media',
  //   icon: <ImageIcon className="h-4 w-4" />,
  //   tabKey: 'media',
  // },
  {
    label: 'CV Preview',
    href: '/cv',
    icon: <FileText className="h-4 w-4" />,
  },
  // {
  //   label: 'Settings',
  //   href: '/settings',
  //   icon: <Settings className="h-4 w-4" />,
  //   tabKey: 'settings',
  // },
];

function SidebarNavLinks() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams?.get('tab');

  const isItemActive = (item: NavItem) => {
    if (item.href === '/dashboard' && pathname === '/dashboard') return true;
    if (item.href === '/settings' && pathname === '/settings') return true;
    if (item.href === '/cv' && pathname === '/cv') return true;
    if (pathname === '/profile') {
      if (item.tabKey && (currentTab === item.tabKey || (!currentTab && item.tabKey === 'general'))) {
        return true;
      }
    }
    return false;
  };

  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const active = isItemActive(item);
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
              active
                ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span
              className={`flex items-center ${
                active ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'
              }`}
            >
              {item.icon}
            </span>
            <span>{item.label}</span>
            {active && (
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export const AppSidebar: React.FC = () => {
  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col justify-between border-r border-slate-200 bg-white p-6 shadow-xs">
      {/* Top: Logo & Main Navigation */}
      <div className="space-y-8">
        <div>
          <Logo size="md" />
        </div>

        <Suspense
          fallback={
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  <span className="text-slate-400">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          }
        >
          <SidebarNavLinks />
        </Suspense>
      </div>

      {/* Bottom: Motivational Pro Card */}
      <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-emerald-50/40 p-4 text-xs text-slate-600 space-y-2 shadow-xs">
        <div className="flex items-center gap-2 text-emerald-700 font-medium">
          <Code2 className="h-4 w-4" />
          <span>Your story. In one place.</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Build a portfolio that opens doors to new opportunities.
        </p>
      </div>
    </aside>
  );
};
