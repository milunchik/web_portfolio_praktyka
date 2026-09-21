import {
  AnalyticsEvent,
  AnalyticsEventType,
  AnalyticsVisitorType,
} from '@prisma/client';
import {
  AnalyticsSummaryResDto,
  AnalyticsViewsPointResDto,
  TopProjectResDto,
  RecentActivityResDto,
} from '../dtos/res';

export interface CreateAnalyticsEventData {
  portfolioOwnerId: number;
  visitorUserId?: number | null;
  anonymousVisitorId?: string | null;
  visitorType: AnalyticsVisitorType;
  eventType: AnalyticsEventType;
  projectId?: number | null;
  target?: string | null;
}

export abstract class AnalyticsRepository {
  abstract create(data: CreateAnalyticsEventData): Promise<AnalyticsEvent>;
  abstract getSummary(portfolioOwnerId: number): Promise<AnalyticsSummaryResDto>;
  abstract getViewsOverTime(
    portfolioOwnerId: number,
    days: number,
  ): Promise<AnalyticsViewsPointResDto[]>;
  abstract getTopProjects(
    portfolioOwnerId: number,
    limit?: number,
  ): Promise<TopProjectResDto[]>;
  abstract getRecentActivity(
    portfolioOwnerId: number,
    limit?: number,
  ): Promise<RecentActivityResDto[]>;
}
