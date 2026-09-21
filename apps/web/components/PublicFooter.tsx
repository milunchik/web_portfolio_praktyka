'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { GithubIcon, LinkedinIcon, TwitterIcon } from './SocialIcons';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200/80 bg-white py-8 mt-12">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6">
        {/* Left: Brand + Tagline */}
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
          <Logo size="sm" showTagline={false} />
          <span className="hidden text-slate-300 sm:inline">•</span>
          <p className="text-xs text-slate-500 font-medium">
            Build. Share. Grow.
          </p>
        </div>

        {/* Right: Links + Socials */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-500">
          <Link href="/#about" className="transition hover:text-emerald-600">
            About
          </Link>
          <Link href="/privacy" className="transition hover:text-emerald-600">
            Privacy
          </Link>
          <Link href="/terms" className="transition hover:text-emerald-600">
            Terms
          </Link>

          <div className="flex items-center gap-3 pl-2 border-l border-slate-200 text-slate-400">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-700 transition"
              aria-label="GitHub"
            >
              <GithubIcon className="h-4 w-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-700 transition"
              aria-label="Twitter"
            >
              <TwitterIcon className="h-4 w-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-700 transition"
              aria-label="LinkedIn"
            >
              <LinkedinIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
