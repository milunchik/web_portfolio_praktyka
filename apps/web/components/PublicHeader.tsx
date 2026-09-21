'use client';

import React from 'react';
import Link from 'next/link';
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
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-2xs">
      <div className="mx-auto flex h-20 max-w-[1200px] items-center justify-between px-4 sm:px-6">
        {/* Left: Brand Logo */}
        <div className="flex items-center">
          <Logo size="sm" showTagline={false} />
        </div>

        {/* Center: In-page Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#projects"
            onClick={(e) => scrollToSection(e, 'projects')}
            className="text-sm font-medium text-slate-600 transition-colors hover:text-emerald-600"
          >
            Projects
          </a>
          <a
            href="#experience"
            onClick={(e) => scrollToSection(e, 'experience')}
            className="text-sm font-medium text-slate-600 transition-colors hover:text-emerald-600"
          >
            Experience
          </a>
          <a
            href="#education"
            onClick={(e) => scrollToSection(e, 'education')}
            className="text-sm font-medium text-slate-600 transition-colors hover:text-emerald-600"
          >
            Education
          </a>
          <a
            href="#about"
            onClick={(e) => scrollToSection(e, 'about')}
            className="text-sm font-medium text-slate-600 transition-colors hover:text-emerald-600"
          >
            About
          </a>
        </nav>

        {/* Right: CTA Button */}
        <div className="flex items-center gap-3">
          <Link href="/signup">
            <Button
              size="md"
              variant="primary"
              className="font-semibold shadow-xs"
            >
              Get your own portfolio
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
