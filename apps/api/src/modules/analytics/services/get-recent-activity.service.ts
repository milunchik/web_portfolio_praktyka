import { Injectable } from '@nestjs/common';
import { AnalyticsRepository } from '../repositories/analytics.repository';
import { RecentActivityResDto } from '../dtos/res';

@Injectable()
export class GetRecentActivityService {
  constructor(private readonly analyticsRepository: AnalyticsRepository) {}

  async execute(
    portfolioOwnerId: number,
    limit = 15,
  ): Promise<RecentActivityResDto[]> {
    return this.analyticsRepository.getRecentActivity(portfolioOwnerId, limit);
  }
}
