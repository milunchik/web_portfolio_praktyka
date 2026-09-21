import { create } from 'zustand';
import { analyticsService } from '../services/analytics.service';
import type {
  AnalyticsSummaryDto,
  AnalyticsViewsPointDto,
  AnalyticsTopProjectDto,
  AnalyticsActivityItemDto,
  AnalyticsViewsPeriod,
  TrackAnalyticsEventDto,
} from '../types/analytics.types';

interface AnalyticsState {
  summary: AnalyticsSummaryDto | null;
  views: AnalyticsViewsPointDto[];
  period: AnalyticsViewsPeriod;
  topProjects: AnalyticsTopProjectDto[];
  recentActivity: AnalyticsActivityItemDto[];
  loading: boolean;
  viewsLoading: boolean;
  projectsLoading: boolean;
  activityLoading: boolean;
  error: string | null;

  fetchAnalyticsSummary: () => Promise<void>;
  fetchViewsAnalytics: (period?: AnalyticsViewsPeriod) => Promise<void>;
  fetchTopProjects: (limit?: number) => Promise<void>;
  fetchRecentActivity: (limit?: number) => Promise<void>;
  trackAnalyticsEvent: (data: TrackAnalyticsEventDto) => Promise<void>;
  setPeriod: (period: AnalyticsViewsPeriod) => void;
  clearError: () => void;
  fetchAllDashboardAnalytics: () => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  summary: null,
  views: [],
  period: '30d',
  topProjects: [],
  recentActivity: [],
  loading: false,
  viewsLoading: false,
  projectsLoading: false,
  activityLoading: false,
  error: null,

  fetchAnalyticsSummary: async () => {
    set({ loading: true, error: null });
    try {
      const summary = await analyticsService.getSummary();
      set({ summary, loading: false });
    } catch (err: any) {
      set({
        error: err?.message
          ? Array.isArray(err.message)
            ? err.message.join(', ')
            : err.message
          : 'Failed to fetch analytics summary',
        loading: false,
      });
    }
  },

  fetchViewsAnalytics: async (period?: AnalyticsViewsPeriod) => {
    const activePeriod = period || get().period;
    set({ viewsLoading: true, period: activePeriod });
    try {
      const views = await analyticsService.getViews(activePeriod);
      set({ views, viewsLoading: false });
    } catch (err: any) {
      console.error('Failed to fetch views analytics:', err);
      set({ viewsLoading: false });
    }
  },

  fetchTopProjects: async (limit = 5) => {
    set({ projectsLoading: true });
    try {
      const topProjects = await analyticsService.getTopProjects(limit);
      set({ topProjects, projectsLoading: false });
    } catch (err: any) {
      console.error('Failed to fetch top projects:', err);
      set({ projectsLoading: false });
    }
  },

  fetchRecentActivity: async (limit = 10) => {
    set({ activityLoading: true });
    try {
      const recentActivity = await analyticsService.getRecentActivity(limit);
      set({ recentActivity, activityLoading: false });
    } catch (err: any) {
      console.error('Failed to fetch recent activity:', err);
      set({ activityLoading: false });
    }
  },

  trackAnalyticsEvent: async (data: TrackAnalyticsEventDto) => {
    await analyticsService.trackEvent(data);
  },

  setPeriod: (period: AnalyticsViewsPeriod) => {
    set({ period });
    get().fetchViewsAnalytics(period);
  },

  fetchAllDashboardAnalytics: async () => {
    const { fetchAnalyticsSummary, fetchViewsAnalytics, fetchTopProjects, fetchRecentActivity } = get();
    await Promise.allSettled([
      fetchAnalyticsSummary(),
      fetchViewsAnalytics(),
      fetchTopProjects(),
      fetchRecentActivity(),
    ]);
  },

  clearError: () => set({ error: null }),
}));
