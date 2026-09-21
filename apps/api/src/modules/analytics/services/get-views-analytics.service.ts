import { Injectable } from '@nestjs/common';
import { AnalyticsRepository } from '../repositories/analytics.repository';
import { AnalyticsViewsPointResDto } from '../dtos/res';

@Injectable()
export class GetViewsAnalyticsService {
  constructor(private readonly analyticsRepository: AnalyticsRepository) {}

  async execute(
    portfolioOwnerId: number,
    period: '7d' | '30d' | '90d' = '30d',
  ): Promise<AnalyticsViewsPointResDto[]> {
    const daysMap: Record<string, number> = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
    };
    const days = daysMap[period] || 30;
    return this.analyticsRepository.getViewsOverTime(portfolioOwnerId, days);
  }
}
