'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, LogOut, User, Globe, ChevronDown, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store';
import { useUserStore } from '../store';

export const AppHeader: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { profile } = useUserStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/signin');
  };

  const displayName = profile?.fullName || user?.fullName || user?.email?.split('@')[0] || 'Jane Doe';
  const initial = displayName.charAt(0).toUpperCase();
  const avatarPhotoUrl =
    profile?.avatarUrl ||
    profile?.fileUrl ||
    user?.avatarUrl ||
    user?.fileUrl ||
    (profile?.fileName?.startsWith('http') ? profile?.fileName : null) ||
    (user?.fileName?.startsWith('http') ? user?.fileName : null) ||
    null;

  const publicUrl = profile?.publicUrl || user?.publicUrl;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/90 px-8 backdrop-blur-md">
      {/* Search Input */}
      <div className="relative w-80 max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search anything..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 transition-all hover:border-slate-300 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      {/* Right User Actions */}
      <div className="relative flex items-center gap-4">
        {publicUrl && (
          <Link
            href={`/user/${publicUrl}`}
            target="_blank"
            className="hidden items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/70 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100/80 sm:flex"
          >
            <Globe className="h-3.5 w-3.5" />
            <span>Public link</span>
          </Link>
        )}

        {/* User Profile Badge */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2.5 rounded-xl p-1.5 transition-colors hover:bg-slate-50 focus:outline-none"
          >
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-xs font-bold text-white shadow-xs">
              {avatarPhotoUrl ? (
                <img
                  src={avatarPhotoUrl}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                initial
              )}
            </div>
            <div className="hidden text-left sm:block">
              <span className="block text-xs font-semibold text-slate-800 leading-tight">
                {displayName}
              </span>
              <span className="block text-[11px] text-slate-500 leading-tight">
                {user?.email || profile?.email || 'user@example.com'}
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {/* User Menu Dropdown */}
          {menuOpen && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/50"
              onMouseLeave={() => setMenuOpen(false)}
            >
              <div className="border-b border-slate-100 p-2 text-xs">
                <p className="font-semibold text-slate-900">{displayName}</p>
                <p className="truncate text-slate-500">{user?.email || profile?.email}</p>
              </div>

              <div className="py-1 space-y-0.5">
                <Link
                  href="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  <User className="h-4 w-4 text-slate-400" />
                  <span>Account Settings</span>
                </Link>
                {/*{publicUrl && (*/}
                {/*  <Link*/}
                {/*    href={`/user/${publicUrl}`}*/}
                {/*    target="_blank"*/}
                {/*    onClick={() => setMenuOpen(false)}*/}
                {/*    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"*/}
                {/*  >*/}
                {/*    <Globe className="h-4 w-4 text-slate-400" />*/}
                {/*    <span>View Public Portfolio</span>*/}
                {/*  </Link>*/}
                {/*)}*/}
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
