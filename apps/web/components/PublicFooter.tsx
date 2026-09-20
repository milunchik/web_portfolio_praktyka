'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="border-t border-slate-200/80 bg-white py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex flex-col items-center sm:items-start gap-2">
            <Logo size="sm" />
            <p className="text-xs text-slate-500">
              Your code. Your story. In one place.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-500">
            <Link href="/" className="hover:text-emerald-600 transition">
              Home
            </Link>
            <Link href="/signup" className="hover:text-emerald-600 transition">
              Create Portfolio
            </Link>
            <Link href="/signin" className="hover:text-emerald-600 transition">
              Sign In
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6 text-center text-[11px] text-slate-400">
          © {new Date().getFullYear()} Devfolio. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
