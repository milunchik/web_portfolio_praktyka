import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, MaxLength } from 'class-validator';
import { AnalyticsEventType } from '@prisma/client';

export class TrackEventReqDto {
  @ApiPropertyOptional({ example: 'jane-doe', description: 'Public URL slug of portfolio owner' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  publicUrl?: string;

  @ApiPropertyOptional({ example: 1, description: 'User ID of portfolio owner' })
  @IsOptional()
  @IsInt()
  portfolioOwnerId?: number;

  @ApiProperty({
    enum: AnalyticsEventType,
    example: 'profile_view',
    description: 'Type of analytics event',
  })
  @IsEnum(AnalyticsEventType)
  eventType!: AnalyticsEventType;

  @ApiPropertyOptional({
    example: 'd9b2d63d-a233-4f9e-a612-421b96a92891',
    description: 'Persistent UUID for anonymous visitors',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  anonymousVisitorId?: string;

  @ApiPropertyOptional({ example: 42, description: 'Project ID for project_click events' })
  @IsOptional()
  @IsInt()
  projectId?: number;

  @ApiPropertyOptional({ example: 'github', description: 'Target for social links or contact clicks' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  target?: string;
}
