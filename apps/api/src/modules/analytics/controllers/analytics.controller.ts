import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  RecordAnalyticsEventService,
  GetAnalyticsSummaryService,
  GetViewsAnalyticsService,
  GetTopProjectsService,
  GetRecentActivityService,
} from '../services';
import { TrackEventReqDto, GetViewsQueryDto } from '../dtos/req';
import {
  AnalyticsSummaryResDto,
  AnalyticsViewsPointResDto,
  TopProjectResDto,
  RecentActivityResDto,
} from '../dtos/res';
import { JwtAuthGuard, OptionalJwtAuthGuard } from '../../../shared/guards';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly recordAnalyticsEventService: RecordAnalyticsEventService,
    private readonly getAnalyticsSummaryService: GetAnalyticsSummaryService,
    private readonly getViewsAnalyticsService: GetViewsAnalyticsService,
    private readonly getTopProjectsService: GetTopProjectsService,
    private readonly getRecentActivityService: GetRecentActivityService,
  ) {}

  @ApiOperation({ summary: 'Track an analytics event on a public portfolio' })
  @ApiResponse({ status: 200, description: 'Event recorded successfully' })
  @UseGuards(OptionalJwtAuthGuard)
  @Post('events')
  @HttpCode(HttpStatus.OK)
  async trackEvent(
    @Body() dto: TrackEventReqDto,
    @CurrentUser() visitorUserId: number | null,
  ) {
    return this.recordAnalyticsEventService.execute(dto, visitorUserId);
  }

  @ApiOperation({ summary: 'Get analytics summary for current authenticated user' })
  @ApiResponse({ status: 200, type: AnalyticsSummaryResDto })
  @ApiBearerAuth('AccessToken')
  @UseGuards(JwtAuthGuard)
  @Get('summary')
  async getSummary(
    @CurrentUser() userId: number,
  ): Promise<AnalyticsSummaryResDto> {
    return this.getAnalyticsSummaryService.execute(userId);
  }

  @ApiOperation({ summary: 'Get daily portfolio views analytics for chart' })
  @ApiResponse({ status: 200, type: [AnalyticsViewsPointResDto] })
  @ApiBearerAuth('AccessToken')
  @UseGuards(JwtAuthGuard)
  @Get('views')
  async getViews(
    @CurrentUser() userId: number,
    @Query() query: GetViewsQueryDto,
  ): Promise<AnalyticsViewsPointResDto[]> {
    return this.getViewsAnalyticsService.execute(userId, query.period);
  }

  @ApiOperation({ summary: 'Get top clicked projects for current user' })
  @ApiResponse({ status: 200, type: [TopProjectResDto] })
  @ApiBearerAuth('AccessToken')
  @UseGuards(JwtAuthGuard)
  @Get('projects')
  async getTopProjects(
    @CurrentUser() userId: number,
    @Query('limit') limit?: string,
  ): Promise<TopProjectResDto[]> {
    const parsedLimit = limit ? parseInt(limit, 10) : 10;
    return this.getTopProjectsService.execute(
      userId,
      isNaN(parsedLimit) ? 10 : parsedLimit,
    );
  }

  @ApiOperation({ summary: 'Get recent analytics activity for current user' })
  @ApiResponse({ status: 200, type: [RecentActivityResDto] })
  @ApiBearerAuth('AccessToken')
  @UseGuards(JwtAuthGuard)
  @Get('activity')
  async getRecentActivity(
    @CurrentUser() userId: number,
    @Query('limit') limit?: string,
  ): Promise<RecentActivityResDto[]> {
    const parsedLimit = limit ? parseInt(limit, 10) : 15;
    return this.getRecentActivityService.execute(
      userId,
      isNaN(parsedLimit) ? 15 : parsedLimit,
    );
  }
}
