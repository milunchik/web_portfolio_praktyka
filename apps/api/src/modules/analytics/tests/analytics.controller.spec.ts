import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsController } from '../controllers/analytics.controller';
import {
  RecordAnalyticsEventService,
  GetAnalyticsSummaryService,
  GetViewsAnalyticsService,
  GetTopProjectsService,
  GetRecentActivityService,
} from '../services';
import { TokenPort } from '../../../shared/domain/ports/token.port';

describe('AnalyticsController', () => {
  let controller: AnalyticsController;

  const mockRecordService = { execute: jest.fn() };
  const mockSummaryService = { execute: jest.fn() };
  const mockViewsService = { execute: jest.fn() };
  const mockTopProjectsService = { execute: jest.fn() };
  const mockRecentActivityService = { execute: jest.fn() };
  const mockTokenPort = {
    generateTokenPair: jest.fn(),
    verifyAccessToken: jest.fn(),
    verifyRefreshToken: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [
        { provide: RecordAnalyticsEventService, useValue: mockRecordService },
        { provide: GetAnalyticsSummaryService, useValue: mockSummaryService },
        { provide: GetViewsAnalyticsService, useValue: mockViewsService },
        { provide: GetTopProjectsService, useValue: mockTopProjectsService },
        { provide: GetRecentActivityService, useValue: mockRecentActivityService },
        { provide: TokenPort, useValue: mockTokenPort },
      ],
    }).compile();

    controller = module.get<AnalyticsController>(AnalyticsController);
  });

  it('should call trackEvent service', async () => {
    mockRecordService.execute.mockResolvedValue({ success: true, recorded: true });
    const dto = { publicUrl: 'jane-doe', eventType: 'profile_view' as const };
    const res = await controller.trackEvent(dto, 2);
    expect(res).toEqual({ success: true, recorded: true });
    expect(mockRecordService.execute).toHaveBeenCalledWith(dto, 2);
  });

  it('should call getSummary service', async () => {
    mockSummaryService.execute.mockResolvedValue({ totalViews: 10 });
    const res = await controller.getSummary(1);
    expect(res).toEqual({ totalViews: 10 });
    expect(mockSummaryService.execute).toHaveBeenCalledWith(1);
  });

  it('should call getViews service', async () => {
    mockViewsService.execute.mockResolvedValue([]);
    const res = await controller.getViews(1, { period: '7d' });
    expect(res).toEqual([]);
    expect(mockViewsService.execute).toHaveBeenCalledWith(1, '7d');
  });

  it('should call getTopProjects service', async () => {
    mockTopProjectsService.execute.mockResolvedValue([]);
    const res = await controller.getTopProjects(1, '5');
    expect(res).toEqual([]);
    expect(mockTopProjectsService.execute).toHaveBeenCalledWith(1, 5);
  });

  it('should call getRecentActivity service', async () => {
    mockRecentActivityService.execute.mockResolvedValue([]);
    const res = await controller.getRecentActivity(1, '10');
    expect(res).toEqual([]);
    expect(mockRecentActivityService.execute).toHaveBeenCalledWith(1, 10);
  });
});
