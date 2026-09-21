import { ApiProperty } from '@nestjs/swagger';

export class AnalyticsViewsPointResDto {
  @ApiProperty({ example: '2026-09-15' })
  date!: string;

  @ApiProperty({ example: 21 })
  total!: number;

  @ApiProperty({ example: 8 })
  authenticated!: number;

  @ApiProperty({ example: 13 })
  anonymous!: number;
}
