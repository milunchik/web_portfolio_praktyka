import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateExperienceService,
  DeleteExperienceService,
  FindExperienceByIdService,
  FindExperiencesByUserService,
  UpdateExperienceService,
} from '../services';
import { CreateExperienceReqDto, UpdateExperienceReqDto } from '../dtos/req';
import { ExperienceResDto } from '../dtos/res';
import { JwtAuthGuard } from '../../../shared/guards';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';

@ApiTags('experience')
@Controller('experience')
export class ExperienceController {
  constructor(
    private readonly createExperienceService: CreateExperienceService,
    private readonly findExperienceByIdService: FindExperienceByIdService,
    private readonly findExperiencesByUserService: FindExperiencesByUserService,
    private readonly updateExperienceService: UpdateExperienceService,
    private readonly deleteExperienceService: DeleteExperienceService,
  ) {}

  @ApiOperation({ summary: 'Get all experiences of current user' })
  @ApiResponse({ status: 200, type: [ExperienceResDto] })
  @ApiBearerAuth('AccessToken')
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyExperiences(@CurrentUser() userId: number): Promise<ExperienceResDto[]> {
    const experiences = await this.findExperiencesByUserService.execute(userId);
    return experiences.map((exp) => exp.toResponseDto());
  }

  @ApiOperation({ summary: 'Get all experiences by user ID' })
  @ApiResponse({ status: 200, type: [ExperienceResDto] })
  @Get('user/:userId')
  async getByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<ExperienceResDto[]> {
    const experiences = await this.findExperiencesByUserService.execute(userId);
    return experiences.map((exp) => exp.toResponseDto());
  }

  @ApiOperation({ summary: 'Get experience by ID' })
  @ApiResponse({ status: 200, type: ExperienceResDto })
  @Get(':id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ExperienceResDto> {
    const experience = await this.findExperienceByIdService.execute(id);
    return experience.toResponseDto();
  }

  @ApiOperation({ summary: 'Create experience for current user' })
  @ApiResponse({ status: 201, type: ExperienceResDto })
  @ApiBearerAuth('AccessToken')
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @CurrentUser() userId: number,
    @Body() dto: CreateExperienceReqDto,
  ): Promise<ExperienceResDto> {
    const experience = await this.createExperienceService.execute(userId, dto);
    return experience.toResponseDto();
  }

  @ApiOperation({ summary: 'Update experience by ID for current user' })
  @ApiResponse({ status: 200, type: ExperienceResDto })
  @ApiBearerAuth('AccessToken')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @CurrentUser() userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateExperienceReqDto,
  ): Promise<ExperienceResDto> {
    const experience = await this.updateExperienceService.execute(userId, id, dto);
    return experience.toResponseDto();
  }

  @ApiOperation({ summary: 'Delete experience by ID for current user' })
  @ApiResponse({ status: 204, description: 'Experience deleted successfully' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('AccessToken')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(
    @CurrentUser() userId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.deleteExperienceService.execute(userId, id);
  }
}
