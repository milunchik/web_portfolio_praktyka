import { ApiProperty } from '@nestjs/swagger';
import { AnalyticsEventType, AnalyticsVisitorType } from '@prisma/client';

export class RecentActivityResDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ enum: AnalyticsEventType, example: 'profile_view' })
  eventType!: AnalyticsEventType;

  @ApiProperty({ example: 'github', nullable: true })
  target!: string | null;

  @ApiProperty({ example: 42, nullable: true })
  projectId!: number | null;

  @ApiProperty({ example: 'Task Manager API', nullable: true })
  projectName!: string | null;

  @ApiProperty({ enum: AnalyticsVisitorType, example: 'authenticated' })
  visitorType!: AnalyticsVisitorType;

  @ApiProperty({ example: '2026-09-21T19:30:00.000Z' })
  createdAt!: Date | string;
}
