import { Module } from '@nestjs/common';
import { AnalyticsController } from './controllers/analytics.controller';
import { AnalyticsRepository } from './repositories/analytics.repository';
import { PrismaAnalyticsRepository } from './repositories/prisma-analytics.repository';
import {
  RecordAnalyticsEventService,
  GetAnalyticsSummaryService,
  GetViewsAnalyticsService,
  GetTopProjectsService,
  GetRecentActivityService,
} from './services';
import { SecurityModule } from '../../shared';

@Module({
  imports: [SecurityModule],
  controllers: [AnalyticsController],
  providers: [
    { provide: AnalyticsRepository, useClass: PrismaAnalyticsRepository },
    RecordAnalyticsEventService,
    GetAnalyticsSummaryService,
    GetViewsAnalyticsService,
    GetTopProjectsService,
    GetRecentActivityService,
  ],
  exports: [
    AnalyticsRepository,
    RecordAnalyticsEventService,
    GetAnalyticsSummaryService,
    GetViewsAnalyticsService,
    GetTopProjectsService,
    GetRecentActivityService,
  ],
})
export class AnalyticsModule {}
