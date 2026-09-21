import { Injectable } from '@nestjs/common';
import { AnalyticsEvent } from '@prisma/client';
import { PrismaService } from '../../../infrastructure';
import {
  AnalyticsRepository,
  CreateAnalyticsEventData,
} from './analytics.repository';
import {
  AnalyticsSummaryResDto,
  AnalyticsViewsPointResDto,
  TopProjectResDto,
  RecentActivityResDto,
} from '../dtos/res';

@Injectable()
export class PrismaAnalyticsRepository extends AnalyticsRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: CreateAnalyticsEventData): Promise<AnalyticsEvent> {
    return this.prisma.analyticsEvent.create({
      data: {
        portfolioOwnerId: data.portfolioOwnerId,
        visitorUserId: data.visitorUserId ?? null,
        anonymousVisitorId: data.anonymousVisitorId ?? null,
        visitorType: data.visitorType,
        eventType: data.eventType,
        projectId: data.projectId ?? null,
        target: data.target ?? null,
      },
    });
  }

  async getSummary(portfolioOwnerId: number): Promise<AnalyticsSummaryResDto> {
    const now = new Date();
    const startOfToday = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0),
    );

    const dayOfWeek = now.getUTCDay(); // 0: Sun, 1: Mon, ...
    const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
    const startOfWeek = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + diffToMonday, 0, 0, 0, 0),
    );

    const startOfMonth = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0),
    );

    const [
      totalViews,
      viewsAuth,
      viewsAnon,
      uniqueAuthGroups,
      uniqueAnonGroups,
      viewsToday,
      viewsThisWeek,
      viewsThisMonth,
      cvDownloads,
      contactClicks,
      projectClicks,
      socialLinkClicks,
    ] = await Promise.all([
      // 1. Total views
      this.prisma.analyticsEvent.count({
        where: { portfolioOwnerId, eventType: 'profile_view' },
      }),
      // 2. Views authenticated
      this.prisma.analyticsEvent.count({
        where: { portfolioOwnerId, eventType: 'profile_view', visitorType: 'authenticated' },
      }),
      // 3. Views anonymous
      this.prisma.analyticsEvent.count({
        where: { portfolioOwnerId, eventType: 'profile_view', visitorType: 'anonymous' },
      }),
      // 4. Unique auth visitors
      this.prisma.analyticsEvent.groupBy({
        by: ['visitorUserId'],
        where: {
          portfolioOwnerId,
          eventType: 'profile_view',
          visitorType: 'authenticated',
          visitorUserId: { not: null },
        },
      }),
      // 5. Unique anon visitors
      this.prisma.analyticsEvent.groupBy({
        by: ['anonymousVisitorId'],
        where: {
          portfolioOwnerId,
          eventType: 'profile_view',
          visitorType: 'anonymous',
          anonymousVisitorId: { not: null },
        },
      }),
      // 6. Views today
      this.prisma.analyticsEvent.count({
        where: {
          portfolioOwnerId,
          eventType: 'profile_view',
          createdAt: { gte: startOfToday },
        },
      }),
      // 7. Views this week
      this.prisma.analyticsEvent.count({
        where: {
          portfolioOwnerId,
          eventType: 'profile_view',
          createdAt: { gte: startOfWeek },
        },
      }),
      // 8. Views this month
      this.prisma.analyticsEvent.count({
        where: {
          portfolioOwnerId,
          eventType: 'profile_view',
          createdAt: { gte: startOfMonth },
        },
      }),
      // 9. CV downloads
      this.prisma.analyticsEvent.count({
        where: { portfolioOwnerId, eventType: 'cv_download' },
      }),
      // 10. Contact clicks
      this.prisma.analyticsEvent.count({
        where: { portfolioOwnerId, eventType: 'contact_click' },
      }),
      // 11. Project clicks
      this.prisma.analyticsEvent.count({
        where: { portfolioOwnerId, eventType: 'project_click' },
      }),
      // 12. Social link clicks
      this.prisma.analyticsEvent.count({
        where: { portfolioOwnerId, eventType: 'social_link_click' },
      }),
    ]);

    const uniqueAuth = uniqueAuthGroups.length;
    const uniqueAnon = uniqueAnonGroups.length;

    return {
      totalViews,
      viewsByVisitorType: {
        authenticated: viewsAuth,
        anonymous: viewsAnon,
      },
      uniqueVisitors: uniqueAuth + uniqueAnon,
      uniqueVisitorsByType: {
        authenticated: uniqueAuth,
        anonymous: uniqueAnon,
      },
      viewsToday,
      viewsThisWeek,
      viewsThisMonth,
      cvDownloads,
      contactClicks,
      projectClicks,
      socialLinkClicks,
    };
  }

  async getViewsOverTime(
    portfolioOwnerId: number,
    days: number,
  ): Promise<AnalyticsViewsPointResDto[]> {
    const now = new Date();
    // Build days map initialized to 0
    const pointsMap = new Map<string, { total: number; authenticated: number; anonymous: number }>();
    const datesList: string[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - i));
      const dateKey = d.toISOString().split('T')[0];
      pointsMap.set(dateKey, { total: 0, authenticated: 0, anonymous: 0 });
      datesList.push(dateKey);
    }

    const startDate = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - (days - 1), 0, 0, 0, 0),
    );

    const events = await this.prisma.analyticsEvent.findMany({
      where: {
        portfolioOwnerId,
        eventType: 'profile_view',
        createdAt: { gte: startDate },
      },
      select: {
        visitorType: true,
        createdAt: true,
      },
    });

    for (const event of events) {
      const dateKey = event.createdAt.toISOString().split('T')[0];
      const entry = pointsMap.get(dateKey);
      if (entry) {
        entry.total += 1;
        if (event.visitorType === 'authenticated') {
          entry.authenticated += 1;
        } else {
          entry.anonymous += 1;
        }
      }
    }

    return datesList.map((dateKey) => {
      const entry = pointsMap.get(dateKey) || { total: 0, authenticated: 0, anonymous: 0 };
      return {
        date: dateKey,
        total: entry.total,
        authenticated: entry.authenticated,
        anonymous: entry.anonymous,
      };
    });
  }

  async getTopProjects(
    portfolioOwnerId: number,
    limit = 10,
  ): Promise<TopProjectResDto[]> {
    const userProjects = await this.prisma.project.findMany({
      where: { userId: portfolioOwnerId },
      select: { id: true, title: true },
    });

    if (userProjects.length === 0) {
      return [];
    }

    const projectIds = userProjects.map((p) => p.id);

    const counts = await this.prisma.analyticsEvent.groupBy({
      by: ['projectId'],
      where: {
        portfolioOwnerId,
        eventType: 'project_click',
        projectId: { in: projectIds },
      },
      _count: {
        id: true,
      },
    });

    const clickMap = new Map<number, number>();
    for (const item of counts) {
      if (item.projectId) {
        clickMap.set(item.projectId, item._count.id);
      }
    }

    const projectDtos: TopProjectResDto[] = userProjects.map((proj) => ({
      projectId: proj.id,
      projectName: proj.title,
      clicks: clickMap.get(proj.id) || 0,
    }));

    // Sort descending by clicks, then alphabetically
    projectDtos.sort((a, b) => b.clicks - a.clicks || a.projectName.localeCompare(b.projectName));

    return projectDtos.slice(0, limit);
  }

  async getRecentActivity(
    portfolioOwnerId: number,
    limit = 15,
  ): Promise<RecentActivityResDto[]> {
    const events = await this.prisma.analyticsEvent.findMany({
      where: { portfolioOwnerId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        project: {
          select: { id: true, title: true },
        },
      },
    });

    return events.map((event) => ({
      id: event.id,
      eventType: event.eventType,
      target: event.target,
      projectId: event.projectId,
      projectName: event.project?.title || null,
      visitorType: event.visitorType,
      createdAt: event.createdAt,
    }));
  }
}
