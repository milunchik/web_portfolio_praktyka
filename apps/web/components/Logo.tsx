import React from 'react';
import Link from 'next/link';

interface LogoProps {
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  showTagline = true,
  size = 'md',
  href = '/',
  className = '',
}) => {
  const iconSize = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  }[size];

  const titleSize = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  }[size];

  const taglineSize = {
    sm: 'text-[11px]',
    md: 'text-xs',
    lg: 'text-sm',
  }[size];

  const content = (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div
        className={`${iconSize} flex items-center justify-center rounded-lg bg-emerald-600 text-white font-mono font-bold shadow-sm ring-1 ring-emerald-500/20`}
      >
        <span className="leading-none select-none">&gt;_</span>
      </div>
      <div className="flex flex-col">
        <span className={`${titleSize} font-bold tracking-tight text-slate-900 leading-none`}>
          Devfolio
        </span>
        {showTagline && (
          <span className={`${taglineSize} text-slate-500 font-medium tracking-normal mt-0.5 leading-none`}>
            Build. Share. Grow.
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block transition-opacity hover:opacity-90">
        {content}
      </Link>
    );
  }

  return content;
};
