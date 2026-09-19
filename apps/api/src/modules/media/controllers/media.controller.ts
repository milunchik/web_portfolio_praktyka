import 'multer';
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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateMediaService,
  DeleteMediaService,
  FindMediaByIdService,
  FindMediaByUserService,
  UpdateMediaService,
  UploadMediaService,
} from '../services';
import { CreateMediaReqDto, UpdateMediaReqDto, UploadMediaReqDto } from '../dtos/req';
import { MediaResDto } from '../dtos/res';
import { JwtAuthGuard } from '../../../shared/guards';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';

@ApiTags('media')
@Controller('media')
export class MediaController {
  constructor(
    private readonly createMediaService: CreateMediaService,
    private readonly uploadMediaService: UploadMediaService,
    private readonly findMediaByIdService: FindMediaByIdService,
    private readonly findMediaByUserService: FindMediaByUserService,
    private readonly updateMediaService: UpdateMediaService,
    private readonly deleteMediaService: DeleteMediaService,
  ) {}

  @ApiOperation({ summary: 'Get all media of current user' })
  @ApiResponse({ status: 200, type: [MediaResDto] })
  @ApiBearerAuth('AccessToken')
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyMedia(@CurrentUser() userId: number): Promise<MediaResDto[]> {
    const medias = await this.findMediaByUserService.execute(userId);
    return medias.map((m) => m.toResponseDto());
  }

  @ApiOperation({ summary: 'Get all media by user ID' })
  @ApiResponse({ status: 200, type: [MediaResDto] })
  @Get('user/:userId')
  async getByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<MediaResDto[]> {
    const medias = await this.findMediaByUserService.execute(userId);
    return medias.map((m) => m.toResponseDto());
  }

  @ApiOperation({ summary: 'Get media by ID' })
  @ApiResponse({ status: 200, type: MediaResDto })
  @Get(':id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MediaResDto> {
    const media = await this.findMediaByIdService.execute(id);
    return media.toResponseDto();
  }

  @ApiOperation({ summary: 'Upload file to storage and create media record' })
  @ApiResponse({ status: 201, type: MediaResDto })
  @ApiBearerAuth('AccessToken')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  async upload(
    @CurrentUser() userId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadMediaReqDto,
  ): Promise<MediaResDto> {
    const media = await this.uploadMediaService.execute(userId, file, dto);
    return media.toResponseDto();
  }

  @ApiOperation({ summary: 'Create media entry manually for current user' })
  @ApiResponse({ status: 201, type: MediaResDto })
  @ApiBearerAuth('AccessToken')
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @CurrentUser() userId: number,
    @Body() dto: CreateMediaReqDto,
  ): Promise<MediaResDto> {
    const media = await this.createMediaService.execute(userId, dto);
    return media.toResponseDto();
  }

  @ApiOperation({ summary: 'Update media by ID for current user' })
  @ApiResponse({ status: 200, type: MediaResDto })
  @ApiBearerAuth('AccessToken')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @CurrentUser() userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMediaReqDto,
  ): Promise<MediaResDto> {
    const media = await this.updateMediaService.execute(userId, id, dto);
    return media.toResponseDto();
  }

  @ApiOperation({ summary: 'Delete media by ID for current user' })
  @ApiResponse({ status: 204, description: 'Media deleted successfully' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('AccessToken')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(
    @CurrentUser() userId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.deleteMediaService.execute(userId, id);
  }
}
