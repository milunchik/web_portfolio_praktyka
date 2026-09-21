import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

export class GetViewsQueryDto {
  @ApiPropertyOptional({
    enum: ['7d', '30d', '90d'],
    default: '30d',
    description: 'Time period for views chart aggregation',
  })
  @IsOptional()
  @IsIn(['7d', '30d', '90d'])
  period?: '7d' | '30d' | '90d' = '30d';
}
