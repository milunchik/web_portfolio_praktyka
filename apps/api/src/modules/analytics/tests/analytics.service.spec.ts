import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import {
  RecordAnalyticsEventService,
  GetAnalyticsSummaryService,
  GetViewsAnalyticsService,
  GetTopProjectsService,
  GetRecentActivityService,
} from '../services';
import { AnalyticsRepository } from '../repositories/analytics.repository';
import { PrismaService } from '../../../infrastructure';

describe('Analytics Services', () => {
  let recordAnalyticsEventService: RecordAnalyticsEventService;
  let getAnalyticsSummaryService: GetAnalyticsSummaryService;
  let getViewsAnalyticsService: GetViewsAnalyticsService;
  let getTopProjectsService: GetTopProjectsService;
  let getRecentActivityService: GetRecentActivityService;

  const mockAnalyticsRepository = {
    create: jest.fn(),
    getSummary: jest.fn(),
    getViewsOverTime: jest.fn(),
    getTopProjects: jest.fn(),
    getRecentActivity: jest.fn(),
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    project: {
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecordAnalyticsEventService,
        GetAnalyticsSummaryService,
        GetViewsAnalyticsService,
        GetTopProjectsService,
        GetRecentActivityService,
        { provide: AnalyticsRepository, useValue: mockAnalyticsRepository },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    recordAnalyticsEventService = module.get<RecordAnalyticsEventService>(RecordAnalyticsEventService);
    getAnalyticsSummaryService = module.get<GetAnalyticsSummaryService>(GetAnalyticsSummaryService);
    getViewsAnalyticsService = module.get<GetViewsAnalyticsService>(GetViewsAnalyticsService);
    getTopProjectsService = module.get<GetTopProjectsService>(GetTopProjectsService);
    getRecentActivityService = module.get<GetRecentActivityService>(GetRecentActivityService);
  });

  describe('RecordAnalyticsEventService', () => {
    it('should throw NotFoundException if portfolio owner is not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      await expect(
        recordAnalyticsEventService.execute({
          publicUrl: 'unknown-user',
          eventType: 'profile_view',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should ignore self-views by the portfolio owner', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 5 });
      const result = await recordAnalyticsEventService.execute(
        {
          publicUrl: 'owner-user',
          eventType: 'profile_view',
        },
        5, // visitor is the owner
      );

      expect(result).toEqual({
        success: true,
        recorded: false,
        reason: 'self_interaction',
      });
      expect(mockAnalyticsRepository.create).not.toHaveBeenCalled();
    });

    it('should record an anonymous visitor profile_view event', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 5 });
      mockAnalyticsRepository.create.mockResolvedValue({ id: 100 });

      const result = await recordAnalyticsEventService.execute(
        {
          publicUrl: 'owner-user',
          eventType: 'profile_view',
          anonymousVisitorId: 'anon-uuid-1234',
        },
        null, // visitor is anonymous
      );

      expect(result).toEqual({ success: true, recorded: true });
      expect(mockAnalyticsRepository.create).toHaveBeenCalledWith({
        portfolioOwnerId: 5,
        visitorUserId: null,
        anonymousVisitorId: 'anon-uuid-1234',
        visitorType: 'anonymous',
        eventType: 'profile_view',
        projectId: null,
        target: null,
      });
    });

    it('should record an authenticated visitor project_click event with valid projectId', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 5 });
      mockPrismaService.project.findFirst.mockResolvedValue({ id: 42 });
      mockAnalyticsRepository.create.mockResolvedValue({ id: 101 });

      const result = await recordAnalyticsEventService.execute(
        {
          portfolioOwnerId: 5,
          eventType: 'project_click',
          projectId: 42,
        },
        99, // another logged-in user
      );

      expect(result).toEqual({ success: true, recorded: true });
      expect(mockAnalyticsRepository.create).toHaveBeenCalledWith({
        portfolioOwnerId: 5,
        visitorUserId: 99,
        anonymousVisitorId: null,
        visitorType: 'authenticated',
        eventType: 'project_click',
        projectId: 42,
        target: null,
      });
    });
  });

  describe('GetAnalyticsSummaryService', () => {
    it('should return summary from repository', async () => {
      const summaryData = {
        totalViews: 10,
        viewsByVisitorType: { authenticated: 4, anonymous: 6 },
        uniqueVisitors: 5,
        uniqueVisitorsByType: { authenticated: 2, anonymous: 3 },
        viewsToday: 2,
        viewsThisWeek: 8,
        viewsThisMonth: 10,
        cvDownloads: 1,
        contactClicks: 2,
        projectClicks: 5,
        socialLinkClicks: 3,
      };
      mockAnalyticsRepository.getSummary.mockResolvedValue(summaryData);

      const result = await getAnalyticsSummaryService.execute(5);
      expect(result).toEqual(summaryData);
      expect(mockAnalyticsRepository.getSummary).toHaveBeenCalledWith(5);
    });
  });

  describe('GetViewsAnalyticsService', () => {
    it('should fetch views over 7d', async () => {
      mockAnalyticsRepository.getViewsOverTime.mockResolvedValue([]);
      await getViewsAnalyticsService.execute(5, '7d');
      expect(mockAnalyticsRepository.getViewsOverTime).toHaveBeenCalledWith(5, 7);
    });

    it('should fetch views over 30d by default', async () => {
      mockAnalyticsRepository.getViewsOverTime.mockResolvedValue([]);
      await getViewsAnalyticsService.execute(5);
      expect(mockAnalyticsRepository.getViewsOverTime).toHaveBeenCalledWith(5, 30);
    });

    it('should fetch views over 90d', async () => {
      mockAnalyticsRepository.getViewsOverTime.mockResolvedValue([]);
      await getViewsAnalyticsService.execute(5, '90d');
      expect(mockAnalyticsRepository.getViewsOverTime).toHaveBeenCalledWith(5, 90);
    });
  });

  describe('GetTopProjectsService', () => {
    it('should return top projects from repository', async () => {
      const topProjects = [{ projectId: 1, projectName: 'Project 1', clicks: 12 }];
      mockAnalyticsRepository.getTopProjects.mockResolvedValue(topProjects);

      const result = await getTopProjectsService.execute(5, 10);
      expect(result).toEqual(topProjects);
      expect(mockAnalyticsRepository.getTopProjects).toHaveBeenCalledWith(5, 10);
    });
  });

  describe('GetRecentActivityService', () => {
    it('should return recent activities from repository', async () => {
      const activity = [
        {
          id: 1,
          eventType: 'profile_view',
          target: null,
          projectId: null,
          projectName: null,
          visitorType: 'authenticated',
          createdAt: new Date(),
        },
      ];
      mockAnalyticsRepository.getRecentActivity.mockResolvedValue(activity);

      const result = await getRecentActivityService.execute(5, 15);
      expect(result).toEqual(activity);
      expect(mockAnalyticsRepository.getRecentActivity).toHaveBeenCalledWith(5, 15);
    });
  });
});
