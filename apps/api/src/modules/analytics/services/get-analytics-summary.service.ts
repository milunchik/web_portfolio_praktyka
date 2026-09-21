import { Injectable } from '@nestjs/common';
import { AnalyticsRepository } from '../repositories/analytics.repository';
import { AnalyticsSummaryResDto } from '../dtos/res';

@Injectable()
export class GetAnalyticsSummaryService {
  constructor(private readonly analyticsRepository: AnalyticsRepository) {}

  async execute(portfolioOwnerId: number): Promise<AnalyticsSummaryResDto> {
    return this.analyticsRepository.getSummary(portfolioOwnerId);
  }
}
