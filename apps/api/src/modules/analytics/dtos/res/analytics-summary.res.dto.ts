import { ApiProperty } from '@nestjs/swagger';

export class VisitorBreakdownResDto {
  @ApiProperty({ example: 120 })
  authenticated!: number;

  @ApiProperty({ example: 230 })
  anonymous!: number;
}

export class AnalyticsSummaryResDto {
  @ApiProperty({ example: 350 })
  totalViews!: number;

  @ApiProperty({ type: VisitorBreakdownResDto })
  viewsByVisitorType!: VisitorBreakdownResDto;

  @ApiProperty({ example: 184 })
  uniqueVisitors!: number;

  @ApiProperty({ type: VisitorBreakdownResDto })
  uniqueVisitorsByType!: VisitorBreakdownResDto;

  @ApiProperty({ example: 18 })
  viewsToday!: number;

  @ApiProperty({ example: 96 })
  viewsThisWeek!: number;

  @ApiProperty({ example: 350 })
  viewsThisMonth!: number;

  @ApiProperty({ example: 27 })
  cvDownloads!: number;

  @ApiProperty({ example: 16 })
  contactClicks!: number;

  @ApiProperty({ example: 88 })
  projectClicks!: number;

  @ApiProperty({ example: 54 })
  socialLinkClicks!: number;
}
