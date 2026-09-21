'use client';

import React from 'react';
import {
  Eye,
  Users,
  Calendar,
  Download,
  Mail,
  FolderGit2,
  Share2,
  TrendingUp,
} from 'lucide-react';
import type { AnalyticsSummaryDto } from '../../types/analytics.types';

interface AnalyticsMetricCardsProps {
  summary: AnalyticsSummaryDto | null;
  loading: boolean;
}

export const AnalyticsMetricCards: React.FC<AnalyticsMetricCardsProps> = ({
  summary,
  loading,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 space-y-3"
          >
            <div className="flex justify-between items-center">
              <div className="h-4 w-24 bg-slate-200 rounded" />
              <div className="h-8 w-8 bg-slate-200 rounded-xl" />
            </div>
            <div className="h-7 w-16 bg-slate-200 rounded" />
            <div className="h-3 w-32 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const s = summary || {
    totalViews: 0,
    viewsByVisitorType: { authenticated: 0, anonymous: 0 },
    uniqueVisitors: 0,
    uniqueVisitorsByType: { authenticated: 0, anonymous: 0 },
    viewsToday: 0,
    viewsThisWeek: 0,
    viewsThisMonth: 0,
    cvDownloads: 0,
    contactClicks: 0,
    projectClicks: 0,
    socialLinkClicks: 0,
  };

  const cards = [
    {
      title: 'Total Views',
      value: s.totalViews,
      subtitle: `${s.viewsByVisitorType.authenticated} auth · ${s.viewsByVisitorType.anonymous} anon`,
      icon: Eye,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
      highlight: true,
    },
    {
      title: 'Unique Visitors',
      value: s.uniqueVisitors,
      subtitle: `${s.uniqueVisitorsByType.authenticated} auth · ${s.uniqueVisitorsByType.anonymous} anon`,
      icon: Users,
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-50',
      highlight: true,
    },
    {
      title: 'Views Today',
      value: s.viewsToday,
      subtitle: 'Since 00:00 UTC today',
      icon: Calendar,
      iconColor: 'text-cyan-600',
      iconBg: 'bg-cyan-50',
    },
    {
      title: 'Views This Week',
      value: s.viewsThisWeek,
      subtitle: `${s.viewsThisMonth} views this month`,
      icon: TrendingUp,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
    },
    {
      title: 'CV Downloads',
      value: s.cvDownloads,
      subtitle: 'Resume PDF downloads',
      icon: Download,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50',
    },
    {
      title: 'Contact Clicks',
      value: s.contactClicks,
      subtitle: 'Email inquiries triggered',
      icon: Mail,
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-50',
    },
    {
      title: 'Project Clicks',
      value: s.projectClicks,
      subtitle: 'Portfolio project interactions',
      icon: FolderGit2,
      iconColor: 'text-teal-600',
      iconBg: 'bg-teal-50',
    },
    {
      title: 'Social Link Clicks',
      value: s.socialLinkClicks,
      subtitle: 'GitHub, LinkedIn, Website...',
      icon: Share2,
      iconColor: 'text-violet-600',
      iconBg: 'bg-violet-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`relative overflow-hidden rounded-2xl border bg-white p-5 shadow-xs transition hover:shadow-md ${
              card.highlight
                ? 'border-emerald-200/80 bg-gradient-to-b from-white to-emerald-50/20'
                : 'border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {card.title}
              </span>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-xl ${card.iconBg} ${card.iconColor}`}
              >
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
              {card.value.toLocaleString()}
            </p>
            <p className="mt-1 text-[11px] font-medium text-slate-500">
              {card.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  );
};
