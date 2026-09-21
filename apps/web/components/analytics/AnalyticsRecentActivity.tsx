'use client';

import React from 'react';
import {
  Activity,
  Eye,
  Download,
  Mail,
  FolderGit2,
  Share2,
  Clock,
  UserCheck,
  UserX,
} from 'lucide-react';
import type { AnalyticsActivityItemDto } from '../../types/analytics.types';

interface AnalyticsRecentActivityProps {
  activity: AnalyticsActivityItemDto[];
  loading: boolean;
}

export const AnalyticsRecentActivity: React.FC<
  AnalyticsRecentActivityProps
> = ({ activity, loading }) => {
  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs animate-pulse space-y-4">
        <div className="h-5 w-36 bg-slate-200 rounded" />
        <div className="space-y-3 pt-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-slate-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const formatRelativeTime = (timestamp: string | Date) => {
    try {
      const d = new Date(timestamp);
      const diffMs = Date.now() - d.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) return `${diffDays}d ago`;
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  const getEventMeta = (item: AnalyticsActivityItemDto) => {
    switch (item.eventType) {
      case 'profile_view':
        return {
          icon: Eye,
          label: 'Public profile viewed',
          color: 'text-emerald-600',
          bg: 'bg-emerald-50',
        };
      case 'cv_download':
        return {
          icon: Download,
          label: 'Resume / CV downloaded',
          color: 'text-amber-600',
          bg: 'bg-amber-50',
        };
      case 'contact_click':
        return {
          icon: Mail,
          label: `Contact inquiry triggered (${item.target || 'email'})`,
          color: 'text-rose-600',
          bg: 'bg-rose-50',
        };
      case 'project_click':
        return {
          icon: FolderGit2,
          label: `Project viewed: ${item.projectName || item.target || 'Project'}`,
          color: 'text-teal-600',
          bg: 'bg-teal-50',
        };
      case 'social_link_click':
        return {
          icon: Share2,
          label: `Social link clicked: ${item.target || 'Link'}`,
          color: 'text-violet-600',
          bg: 'bg-violet-50',
        };
      default:
        return {
          icon: Activity,
          label: 'Portfolio interaction',
          color: 'text-slate-600',
          bg: 'bg-slate-50',
        };
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Recent Activity
            </h3>
            <p className="text-xs text-slate-500">
              Latest anonymized visitor actions
            </p>
          </div>
        </div>
      </div>

      {activity.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
          <Clock className="h-7 w-7 text-slate-300" />
          <p className="mt-2 text-xs font-semibold text-slate-600">
            No activity recorded yet
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Interactions with your public portfolio will show up in this live feed.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 overflow-hidden">
          {activity.map((item) => {
            const meta = getEventMeta(item);
            const Icon = meta.icon;
            const isAuth = item.visitorType === 'authenticated';

            return (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 py-3 text-xs first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${meta.bg} ${meta.color}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 truncate">
                      {meta.label}
                    </p>
                    <div className="flex items-center gap-2 pt-0.5 text-[11px] text-slate-400">
                      <span suppressHydrationWarning>{formatRelativeTime(item.createdAt)}</span>
                      <span>·</span>
                      <span
                        className={`inline-flex items-center gap-1 font-medium ${
                          isAuth ? 'text-emerald-600' : 'text-slate-500'
                        }`}
                      >
                        {isAuth ? (
                          <>
                            <UserCheck className="h-3 w-3" /> Logged-in user
                          </>
                        ) : (
                          <>
                            <UserX className="h-3 w-3" /> Anonymous guest
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
