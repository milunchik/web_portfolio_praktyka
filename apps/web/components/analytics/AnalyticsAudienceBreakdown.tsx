'use client';

import React from 'react';
import { Users, UserCheck, UserX, ShieldCheck } from 'lucide-react';
import type { AnalyticsSummaryDto } from '../../types/analytics.types';

interface AnalyticsAudienceBreakdownProps {
  summary: AnalyticsSummaryDto | null;
  loading: boolean;
}

export const AnalyticsAudienceBreakdown: React.FC<
  AnalyticsAudienceBreakdownProps
> = ({ summary, loading }) => {
  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs animate-pulse space-y-4">
        <div className="h-5 w-40 bg-slate-200 rounded" />
        <div className="h-4 w-64 bg-slate-100 rounded" />
        <div className="h-20 bg-slate-100 rounded-2xl" />
      </div>
    );
  }

  const totalViews = summary?.totalViews || 0;
  const authViews = summary?.viewsByVisitorType?.authenticated || 0;
  const anonViews = summary?.viewsByVisitorType?.anonymous || 0;

  const authPercent = totalViews > 0 ? Math.round((authViews / totalViews) * 100) : 0;
  const anonPercent = totalViews > 0 ? 100 - authPercent : 0;

  const totalUnique = summary?.uniqueVisitors || 0;
  const authUnique = summary?.uniqueVisitorsByType?.authenticated || 0;
  const anonUnique = summary?.uniqueVisitorsByType?.anonymous || 0;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Visitor Breakdown
            </h3>
            <p className="text-xs text-slate-500">
              Authenticated developers vs anonymous guests
            </p>
          </div>
        </div>
        <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Privacy Preserved</span>
        </div>
      </div>

      {/* Segmented Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-semibold text-slate-700">
          <span className="text-emerald-700">
            Authenticated ({authPercent}%)
          </span>
          <span className="text-indigo-700">
            Anonymous ({anonPercent}%)
          </span>
        </div>
        <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden flex">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${authPercent}%` }}
          />
          <div
            className="h-full bg-indigo-400 transition-all duration-500"
            style={{ width: `${anonPercent}%` }}
          />
        </div>
      </div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <UserCheck className="h-4 w-4 text-emerald-600" />
            <span>Logged-in Users</span>
          </div>
          <p className="text-xl font-bold text-slate-900">{authViews.toLocaleString()} views</p>
          <p className="text-[11px] text-slate-500">
            {authUnique} unique registered developers
          </p>
        </div>

        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4 space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-800">
            <UserX className="h-4 w-4 text-indigo-600" />
            <span>Anonymous Visitors</span>
          </div>
          <p className="text-xl font-bold text-slate-900">{anonViews.toLocaleString()} views</p>
          <p className="text-[11px] text-slate-500">
            {anonUnique} unique browser sessions
          </p>
        </div>
      </div>
    </div>
  );
};
