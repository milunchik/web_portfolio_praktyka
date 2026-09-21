'use client';

import React from 'react';
import Link from 'next/link';
import { FolderGit2, MousePointerClick, ArrowUpRight } from 'lucide-react';
import type { AnalyticsTopProjectDto } from '../../types/analytics.types';

interface AnalyticsTopProjectsProps {
  projects: AnalyticsTopProjectDto[];
  loading: boolean;
}

export const AnalyticsTopProjects: React.FC<AnalyticsTopProjectsProps> = ({
  projects,
  loading,
}) => {
  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs animate-pulse space-y-4">
        <div className="h-5 w-32 bg-slate-200 rounded" />
        <div className="h-24 bg-slate-100 rounded-2xl" />
      </div>
    );
  }

  const maxClicks = Math.max(...projects.map((p) => p.clicks), 1);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
            <FolderGit2 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Top Projects</h3>
            <p className="text-xs text-slate-500">
              Ranked by visitor interaction & clicks
            </p>
          </div>
        </div>
        <Link
          href="/profile?tab=projects"
          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition inline-flex items-center gap-1"
        >
          <span>Manage</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
          <MousePointerClick className="h-7 w-7 text-slate-300" />
          <p className="mt-2 text-xs font-semibold text-slate-600">
            No project clicks yet
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Add featured projects in your profile to start tracking interest.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((proj, idx) => {
            const percent = Math.round((proj.clicks / maxClicks) * 100);
            return (
              <div
                key={proj.projectId}
                className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 transition hover:bg-slate-50 hover:border-slate-200"
              >
                <div className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                        idx === 0
                          ? 'bg-amber-100 text-amber-800'
                          : idx === 1
                            ? 'bg-slate-200 text-slate-700'
                            : idx === 2
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      #{idx + 1}
                    </span>
                    <span className="font-bold text-slate-900 truncate">
                      {proj.projectName}
                    </span>
                  </div>

                  <span className="shrink-0 font-semibold text-emerald-600">
                    {proj.clicks} {proj.clicks === 1 ? 'click' : 'clicks'}
                  </span>
                </div>

                {/* Relative click progress bar */}
                <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(percent, 4)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
