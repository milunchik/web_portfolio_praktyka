import { apiClient, ApiClient } from './api-client';
import { getOrCreateAnonymousVisitorId } from '../utils/visitor';
import type {
  TrackAnalyticsEventDto,
  AnalyticsSummaryDto,
  AnalyticsViewsPointDto,
  AnalyticsTopProjectDto,
  AnalyticsActivityItemDto,
  AnalyticsViewsPeriod,
} from '../types/analytics.types';

export class AnalyticsService {
  constructor(private readonly client: ApiClient = apiClient) {}

  async trackEvent(
    data: TrackAnalyticsEventDto,
  ): Promise<{ success: boolean; recorded: boolean }> {
    try {
      const anonymousVisitorId = data.anonymousVisitorId || getOrCreateAnonymousVisitorId();
      return await this.client.post<{ success: boolean; recorded: boolean }>(
        '/analytics/events',
        {
          ...data,
          anonymousVisitorId,
        },
      );
    } catch (err) {
      // Analytics tracking failures should be non-blocking
      console.warn('Analytics event tracking failed silently:', err);
      return { success: false, recorded: false };
    }
  }

  async getSummary(token?: string): Promise<AnalyticsSummaryDto> {
    return this.client.get<AnalyticsSummaryDto>('/analytics/summary', { token });
  }

  async getViews(
    period: AnalyticsViewsPeriod = '30d',
    token?: string,
  ): Promise<AnalyticsViewsPointDto[]> {
    return this.client.get<AnalyticsViewsPointDto[]>('/analytics/views', {
      params: { period },
      token,
    });
  }

  async getTopProjects(
    limit = 10,
    token?: string,
  ): Promise<AnalyticsTopProjectDto[]> {
    return this.client.get<AnalyticsTopProjectDto[]>('/analytics/projects', {
      params: { limit },
      token,
    });
  }

  async getRecentActivity(
    limit = 15,
    token?: string,
  ): Promise<AnalyticsActivityItemDto[]> {
    return this.client.get<AnalyticsActivityItemDto[]>('/analytics/activity', {
      params: { limit },
      token,
    });
  }
}

export const analyticsService = new AnalyticsService();
