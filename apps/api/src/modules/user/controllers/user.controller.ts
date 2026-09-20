import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  ParseIntPipe,
  Patch,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiProduces } from '@nestjs/swagger';
import {
  FindUserByIdService,
  FindUserByPublicUrlService,
  UpdateUserService,
  GenerateUserCvPdfService,
} from '../services';
import { UpdateUserReqDto } from '../dtos/req';
import { SafeUserResDto } from '../dtos/res';
import { JwtAuthGuard } from '../../../shared/guards';
import { CurrentUser } from '../../../shared/decorators';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly findUserById: FindUserByIdService,
    private readonly findUserByPublicUrl: FindUserByPublicUrlService,
    private readonly updateUserService: UpdateUserService,
    private readonly generateUserCvPdfService: GenerateUserCvPdfService,
  ) {}

  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, type: SafeUserResDto })
  @ApiBearerAuth('AccessToken')
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@CurrentUser() userId: number): Promise<SafeUserResDto> {
    const user = await this.findUserById.execute(userId);
    return user.toSafeDto();
  }

  @ApiOperation({ summary: 'Get current user CV as PDF' })
  @ApiResponse({ status: 200, description: 'User CV in PDF format' })
  @ApiProduces('application/pdf')
  @ApiBearerAuth('AccessToken')
  @UseGuards(JwtAuthGuard)
  @Get('me/cv')
  async getMyCv(
    @CurrentUser() userId: number,
    @Res() res: Response,
  ): Promise<void> {
    const { buffer, fileName } = await this.generateUserCvPdfService.executeById(userId);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${fileName}"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, type: SafeUserResDto })
  @ApiBearerAuth('AccessToken')
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMe(
    @CurrentUser() userId: number,
    @Body() dto: UpdateUserReqDto,
  ): Promise<SafeUserResDto> {
    const user = await this.updateUserService.execute(userId, dto);
    return user.toSafeDto();
  }

  @ApiOperation({ summary: 'Get public user CV as PDF by public URL' })
  @ApiResponse({ status: 200, description: 'Public User CV in PDF format' })
  @ApiProduces('application/pdf')
  @Get('public/:publicUrl/cv')
  async getPublicCv(
    @Param('publicUrl') publicUrl: string,
    @Res() res: Response,
  ): Promise<void> {
    const { buffer, fileName } = await this.generateUserCvPdfService.executeByPublicUrl(publicUrl);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${fileName}"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @ApiOperation({ summary: 'Get public user profile by public URL' })
  @ApiResponse({ status: 200, type: SafeUserResDto })
  @Get('public/:publicUrl')
  async getByPublicUrl(
    @Param('publicUrl') publicUrl: string,
  ): Promise<SafeUserResDto> {
    const user = await this.findUserByPublicUrl.execute(publicUrl);
    return user.toSafeDto();
  }

  @ApiOperation({ summary: 'Get user CV as PDF by ID' })
  @ApiResponse({ status: 200, description: 'User CV in PDF format' })
  @ApiProduces('application/pdf')
  @Get(':id/cv')
  async getUserCvById(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<void> {
    const { buffer, fileName } = await this.generateUserCvPdfService.executeById(id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${fileName}"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @ApiOperation({ summary: 'Get user profile by ID' })
  @ApiResponse({ status: 200, type: SafeUserResDto })
  @ApiBearerAuth('AccessToken')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SafeUserResDto> {
    const user = await this.findUserById.execute(id);
    return user.toSafeDto();
  }
}
