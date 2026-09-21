'use client';

import React, { useState } from 'react';
import { Share2, Copy, Check, ExternalLink, Sparkles } from 'lucide-react';
import { Button } from '../Button';

interface AnalyticsEmptyStateProps {
  publicSlug: string;
}

export const AnalyticsEmptyState: React.FC<AnalyticsEmptyStateProps> = ({
  publicSlug,
}) => {
  const [copied, setCopied] = useState(false);

  const fullUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/user/${publicSlug}`
      : `https://devfolio.io/user/${publicSlug}`;

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-200/80 bg-gradient-to-br from-white via-emerald-50/20 to-teal-50/30 p-8 shadow-xs">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/80 px-3 py-1 text-xs font-semibold text-emerald-800">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Ready for Visitors</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Start tracking real-time portfolio analytics
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Share your public portfolio link with recruiters, engineering managers, or on your socials. You will automatically see visits, CV downloads, and project interactions appear here.
          </p>
        </div>

        <div className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-3">
          <div className="flex w-full sm:w-auto items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-mono text-slate-700 shadow-2xs">
            <span className="truncate max-w-[200px] sm:max-w-[280px]">
              {fullUrl}
            </span>
            <button
              onClick={handleCopy}
              className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition"
              title="Copy URL"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <a href={`/user/${publicSlug}`} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="md"
              fullWidth
              leftIcon={<ExternalLink className="h-4 w-4" />}
            >
              Preview Portfolio
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};
