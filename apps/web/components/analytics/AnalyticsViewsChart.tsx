'use client';

import React, { useState } from 'react';
import { Calendar, BarChart3, TrendingUp } from 'lucide-react';
import type {
  AnalyticsViewsPointDto,
  AnalyticsViewsPeriod,
} from '../../types/analytics.types';

interface AnalyticsViewsChartProps {
  views: AnalyticsViewsPointDto[];
  period: AnalyticsViewsPeriod;
  onPeriodChange: (period: AnalyticsViewsPeriod) => void;
  loading: boolean;
}

export const AnalyticsViewsChart: React.FC<AnalyticsViewsChartProps> = ({
  views,
  period,
  onPeriodChange,
  loading,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<AnalyticsViewsPointDto | null>(
    null,
  );

  const totalPeriodViews = views.reduce((acc, curr) => acc + curr.total, 0);
  const totalAuth = views.reduce((acc, curr) => acc + curr.authenticated, 0);
  const totalAnon = views.reduce((acc, curr) => acc + curr.anonymous, 0);

  const maxVal = Math.max(...views.map((v) => v.total), 5);

  const formatDateLabel = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const monthNames = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ];
        const month = monthNames[parseInt(parts[1], 10) - 1];
        const day = parseInt(parts[2], 10);
        return `${month} ${day}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header: Title, Totals, Period Switcher */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Portfolio Views Over Time
            </h3>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {totalPeriodViews.toLocaleString()} total views in selected period (
            <span className="text-emerald-700 font-semibold">{totalAuth} auth</span>,{' '}
            <span className="text-slate-600 font-semibold">{totalAnon} anon</span>)
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="inline-flex rounded-xl bg-slate-100 p-1">
          {(['7d', '30d', '90d'] as AnalyticsViewsPeriod[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPeriodChange(p)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                period === p
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chart Canvas / Bars */}
      {loading ? (
        <div className="h-64 w-full flex items-center justify-center bg-slate-50/50 rounded-2xl animate-pulse">
          <span className="text-xs font-medium text-slate-400">Loading views chart...</span>
        </div>
      ) : views.length === 0 || totalPeriodViews === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
          <BarChart3 className="h-8 w-8 text-slate-300" />
          <p className="mt-2 text-sm font-semibold text-slate-700">
            No view data for this period
          </p>
          <p className="mt-1 text-xs text-slate-400 max-w-xs">
            As visitors view your public portfolio, their visits will appear here broken down by day.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Active Hover Tooltip Card */}
          {hoveredPoint && (
            <div className="flex flex-wrap items-center gap-4 rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-2 text-xs">
              <span className="font-bold text-slate-800">
                {formatDateLabel(hoveredPoint.date)}
              </span>
              <span className="text-slate-600">
                Total:{' '}
                <strong className="text-slate-900">{hoveredPoint.total}</strong>
              </span>
              <span className="text-emerald-700">
                Authenticated:{' '}
                <strong>{hoveredPoint.authenticated}</strong>
              </span>
              <span className="text-indigo-700">
                Anonymous:{' '}
                <strong>{hoveredPoint.anonymous}</strong>
              </span>
            </div>
          )}

          {/* Bar Chart Visualization */}
          <div className="relative h-60 w-full pt-4">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
              <div className="border-b border-slate-200 text-[10px] text-slate-400">
                {maxVal}
              </div>
              <div className="border-b border-slate-200 text-[10px] text-slate-400">
                {Math.round(maxVal / 2)}
              </div>
              <div className="border-b border-slate-200 text-[10px] text-slate-400">
                0
              </div>
            </div>

            {/* Bars */}
            <div className="relative z-10 flex h-full items-end gap-1 sm:gap-1.5 px-2 pb-6">
              {views.map((point) => {
                const heightPercent = maxVal > 0 ? (point.total / maxVal) * 100 : 0;
                const authPercent =
                  point.total > 0
                    ? (point.authenticated / point.total) * 100
                    : 0;
                const anonPercent =
                  point.total > 0 ? (point.anonymous / point.total) * 100 : 0;

                return (
                  <div
                    key={point.date}
                    onMouseEnter={() => setHoveredPoint(point)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    className="group relative flex-1 flex flex-col justify-end h-full cursor-pointer"
                  >
                    {/* Stacked bar */}
                    <div
                      className="w-full rounded-t-sm transition-all duration-200 group-hover:opacity-80 flex flex-col justify-end overflow-hidden"
                      style={{
                        height: `${Math.max(heightPercent, point.total > 0 ? 6 : 2)}%`,
                        backgroundColor:
                          point.total === 0 ? 'rgba(226, 232, 240, 0.5)' : undefined,
                      }}
                    >
                      {point.total > 0 && (
                        <>
                          <div
                            className="w-full bg-emerald-500"
                            style={{ height: `${authPercent}%` }}
                            title={`Authenticated: ${point.authenticated}`}
                          />
                          <div
                            className="w-full bg-indigo-400"
                            style={{ height: `${anonPercent}%` }}
                            title={`Anonymous: ${point.anonymous}`}
                          />
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend & Date Extents */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-slate-500">
            <span className="text-[11px] font-medium">
              {formatDateLabel(views[0]?.date || '')}
            </span>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-medium text-slate-600">
                  Authenticated
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-400" />
                <span className="text-[11px] font-medium text-slate-600">
                  Anonymous
                </span>
              </div>
            </div>

            <span className="text-[11px] font-medium">
              {formatDateLabel(views[views.length - 1]?.date || '')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
