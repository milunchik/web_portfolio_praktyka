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
  CreateLanguageService,
  DeleteLanguageService,
  FindLanguageByIdService,
  FindLanguagesByUserService,
  UpdateLanguageService,
} from '../services';
import { CreateLanguageReqDto, UpdateLanguageReqDto } from '../dtos/req';
import { LanguageResDto } from '../dtos/res';
import { JwtAuthGuard } from '../../../shared/guards';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';

@ApiTags('language')
@Controller('language')
export class LanguageController {
  constructor(
    private readonly createLanguageService: CreateLanguageService,
    private readonly findLanguageByIdService: FindLanguageByIdService,
    private readonly findLanguagesByUserService: FindLanguagesByUserService,
    private readonly updateLanguageService: UpdateLanguageService,
    private readonly deleteLanguageService: DeleteLanguageService,
  ) {}

  @ApiOperation({ summary: 'Get all languages of current user' })
  @ApiResponse({ status: 200, type: [LanguageResDto] })
  @ApiBearerAuth('AccessToken')
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyLanguages(@CurrentUser() userId: number): Promise<LanguageResDto[]> {
    const languages = await this.findLanguagesByUserService.execute(userId);
    return languages.map((lang) => lang.toResponseDto());
  }

  @ApiOperation({ summary: 'Get all languages by user ID' })
  @ApiResponse({ status: 200, type: [LanguageResDto] })
  @Get('user/:userId')
  async getByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<LanguageResDto[]> {
    const languages = await this.findLanguagesByUserService.execute(userId);
    return languages.map((lang) => lang.toResponseDto());
  }

  @ApiOperation({ summary: 'Get language by ID' })
  @ApiResponse({ status: 200, type: LanguageResDto })
  @Get(':id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<LanguageResDto> {
    const language = await this.findLanguageByIdService.execute(id);
    return language.toResponseDto();
  }

  @ApiOperation({ summary: 'Add language for current user' })
  @ApiResponse({ status: 201, type: LanguageResDto })
  @ApiBearerAuth('AccessToken')
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @CurrentUser() userId: number,
    @Body() dto: CreateLanguageReqDto,
  ): Promise<LanguageResDto> {
    const language = await this.createLanguageService.execute(userId, dto);
    return language.toResponseDto();
  }

  @ApiOperation({ summary: 'Update language by ID for current user' })
  @ApiResponse({ status: 200, type: LanguageResDto })
  @ApiBearerAuth('AccessToken')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @CurrentUser() userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLanguageReqDto,
  ): Promise<LanguageResDto> {
    const language = await this.updateLanguageService.execute(userId, id, dto);
    return language.toResponseDto();
  }

  @ApiOperation({ summary: 'Delete language by ID for current user' })
  @ApiResponse({ status: 204, description: 'Language deleted successfully' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('AccessToken')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(
    @CurrentUser() userId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.deleteLanguageService.execute(userId, id);
  }
}
