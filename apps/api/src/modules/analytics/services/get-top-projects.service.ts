import { Injectable } from '@nestjs/common';
import { AnalyticsRepository } from '../repositories/analytics.repository';
import { TopProjectResDto } from '../dtos/res';

@Injectable()
export class GetTopProjectsService {
  constructor(private readonly analyticsRepository: AnalyticsRepository) {}

  async execute(portfolioOwnerId: number, limit = 10): Promise<TopProjectResDto[]> {
    return this.analyticsRepository.getTopProjects(portfolioOwnerId, limit);
  }
}
