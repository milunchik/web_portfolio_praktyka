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
  CreateEducationService,
  DeleteEducationService,
  FindEducationByIdService,
  FindEducationsByUserService,
  UpdateEducationService,
} from '../services';
import { CreateEducationReqDto, UpdateEducationReqDto } from '../dtos';
import { EducationResDto } from '../dtos';
import { JwtAuthGuard } from '../../../shared';
import { CurrentUser } from '../../../shared';

@ApiTags('education')
@Controller('education')
export class EducationController {
  constructor(
    private readonly createEducationService: CreateEducationService,
    private readonly findEducationByIdService: FindEducationByIdService,
    private readonly findEducationsByUserService: FindEducationsByUserService,
    private readonly updateEducationService: UpdateEducationService,
    private readonly deleteEducationService: DeleteEducationService,
  ) {}

  @ApiOperation({ summary: 'Get all education records of current user' })
  @ApiResponse({ status: 200, type: [EducationResDto] })
  @ApiBearerAuth('AccessToken')
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyEducations(@CurrentUser() userId: number): Promise<EducationResDto[]> {
    const educations = await this.findEducationsByUserService.execute(userId);
    return educations.map((edu) => edu.toResponseDto());
  }

  @ApiOperation({ summary: 'Get all education records by user ID' })
  @ApiResponse({ status: 200, type: [EducationResDto] })
  @Get('user/:userId')
  async getByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<EducationResDto[]> {
    const educations = await this.findEducationsByUserService.execute(userId);
    return educations.map((edu) => edu.toResponseDto());
  }

  @ApiOperation({ summary: 'Get education record by ID' })
  @ApiResponse({ status: 200, type: EducationResDto })
  @Get(':id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<EducationResDto> {
    const education = await this.findEducationByIdService.execute(id);
    return education.toResponseDto();
  }

  @ApiOperation({ summary: 'Create education record for current user' })
  @ApiResponse({ status: 201, type: EducationResDto })
  @ApiBearerAuth('AccessToken')
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @CurrentUser() userId: number,
    @Body() dto: CreateEducationReqDto,
  ): Promise<EducationResDto> {
    const education = await this.createEducationService.execute(userId, dto);
    return education.toResponseDto();
  }

  @ApiOperation({ summary: 'Update education record by ID for current user' })
  @ApiResponse({ status: 200, type: EducationResDto })
  @ApiBearerAuth('AccessToken')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @CurrentUser() userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEducationReqDto,
  ): Promise<EducationResDto> {
    const education = await this.updateEducationService.execute(userId, id, dto);
    return education.toResponseDto();
  }

  @ApiOperation({ summary: 'Delete education record by ID for current user' })
  @ApiResponse({ status: 204, description: 'Education record deleted successfully' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('AccessToken')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(
    @CurrentUser() userId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.deleteEducationService.execute(userId, id);
  }
}
