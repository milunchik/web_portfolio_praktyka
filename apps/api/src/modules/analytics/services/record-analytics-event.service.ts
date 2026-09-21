import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure';
import { AnalyticsRepository } from '../repositories/analytics.repository';
import { TrackEventReqDto } from '../dtos/req';

export interface RecordAnalyticsResult {
  success: boolean;
  recorded: boolean;
  reason?: string;
}

@Injectable()
export class RecordAnalyticsEventService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly analyticsRepository: AnalyticsRepository,
  ) {}

  async execute(
    dto: TrackEventReqDto,
    visitorUserId?: number | null,
  ): Promise<RecordAnalyticsResult> {
    // 1. Resolve portfolio owner from publicUrl or portfolioOwnerId
    let ownerId: number | null = null;

    if (dto.publicUrl) {
      const user = await this.prisma.user.findUnique({
        where: { publicUrl: dto.publicUrl },
        select: { id: true },
      });
      if (user) {
        ownerId = user.id;
      }
    } else if (dto.portfolioOwnerId) {
      const user = await this.prisma.user.findUnique({
        where: { id: dto.portfolioOwnerId },
        select: { id: true },
      });
      if (user) {
        ownerId = user.id;
      }
    }

    if (!ownerId) {
      throw new NotFoundException('Portfolio owner not found');
    }

    // 2. Prevent portfolio owner from recording analytics on their own portfolio
    if (visitorUserId && visitorUserId === ownerId) {
      return {
        success: true,
        recorded: false,
        reason: 'self_interaction',
      };
    }

    // 3. Determine visitor type
    const visitorType = visitorUserId ? 'authenticated' : 'anonymous';

    // 4. Validate projectId if provided
    let validProjectId: number | null = null;
    if (dto.projectId) {
      const project = await this.prisma.project.findFirst({
        where: {
          id: dto.projectId,
          userId: ownerId,
        },
        select: { id: true },
      });
      if (project) {
        validProjectId = project.id;
      }
    }

    // 5. Create analytics event
    await this.analyticsRepository.create({
      portfolioOwnerId: ownerId,
      visitorUserId: visitorUserId ?? null,
      anonymousVisitorId: visitorType === 'anonymous' ? (dto.anonymousVisitorId || null) : null,
      visitorType,
      eventType: dto.eventType,
      projectId: validProjectId,
      target: dto.target ? String(dto.target).slice(0, 100) : null,
    });

    return {
      success: true,
      recorded: true,
    };
  }
}
