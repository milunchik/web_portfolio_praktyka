'use client';

import React from 'react';
import Link from 'next/link';
import { Download, Sparkles, ArrowUpRight } from 'lucide-react';
import { Logo } from './Logo';
import { Button } from './Button';

interface PublicHeaderProps {
  onDownloadCv?: () => void;
  isDownloadingCv?: boolean;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  onDownloadCv,
  isDownloadingCv = false,
}) => {
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-8">
        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Logo size="sm" />
        </Link>

        {/* Center: In-page Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <a
            href="#about"
            onClick={(e) => scrollToSection(e, 'about')}
            className="text-xs font-semibold text-slate-600 transition-colors hover:text-emerald-600"
          >
            About
          </a>
          <a
            href="#skills"
            onClick={(e) => scrollToSection(e, 'skills')}
            className="text-xs font-semibold text-slate-600 transition-colors hover:text-emerald-600"
          >
            Tech Stack
          </a>
          <a
            href="#projects"
            onClick={(e) => scrollToSection(e, 'projects')}
            className="text-xs font-semibold text-slate-600 transition-colors hover:text-emerald-600"
          >
            Projects
          </a>
          <a
            href="#experience"
            onClick={(e) => scrollToSection(e, 'experience')}
            className="text-xs font-semibold text-slate-600 transition-colors hover:text-emerald-600"
          >
            Experience
          </a>
          <a
            href="#education"
            onClick={(e) => scrollToSection(e, 'education')}
            className="text-xs font-semibold text-slate-600 transition-colors hover:text-emerald-600"
          >
            Education
          </a>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {onDownloadCv && (
            <Button
              size="sm"
              variant="primary"
              isLoading={isDownloadingCv}
              leftIcon={<Download className="h-3.5 w-3.5" />}
              onClick={onDownloadCv}
            >
              Download CV
            </Button>
          )}

          <Link
            href="/signup"
            className="hidden items-center gap-1 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition sm:flex"
          >
            <span>Get your portfolio</span>
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </header>
  );
};
