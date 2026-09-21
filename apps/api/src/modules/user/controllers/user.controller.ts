import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
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
  UpdateEmailService,
  ChangePasswordService,
  DeleteUserService,
} from '../services';
import {
  UpdateUserReqDto,
  GenerateCvQueryDto,
  UpdateEmailReqDto,
  ChangePasswordReqDto,
} from '../dtos/req';
import { SafeUserResDto, MessageResDto } from '../dtos/res';
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
    private readonly updateEmailService: UpdateEmailService,
    private readonly changePasswordService: ChangePasswordService,
    private readonly deleteUserService: DeleteUserService,
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

  @ApiOperation({ summary: 'Update current user email address' })
  @ApiResponse({ status: 200, type: SafeUserResDto })
  @ApiBearerAuth('AccessToken')
  @UseGuards(JwtAuthGuard)
  @Patch('me/email')
  async updateEmail(
    @CurrentUser() userId: number,
    @Body() dto: UpdateEmailReqDto,
  ): Promise<SafeUserResDto> {
    const user = await this.updateEmailService.execute(userId, dto);
    return user.toSafeDto();
  }

  @ApiOperation({ summary: 'Change current user password' })
  @ApiResponse({ status: 200, type: MessageResDto })
  @ApiBearerAuth('AccessToken')
  @UseGuards(JwtAuthGuard)
  @Post('me/change-password')
  async changePassword(
    @CurrentUser() userId: number,
    @Body() dto: ChangePasswordReqDto,
  ): Promise<MessageResDto> {
    return this.changePasswordService.execute(userId, dto);
  }

  @ApiOperation({ summary: 'Delete current user account and all data' })
  @ApiResponse({ status: 200, type: MessageResDto })
  @ApiBearerAuth('AccessToken')
  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async deleteMe(@CurrentUser() userId: number): Promise<MessageResDto> {
    return this.deleteUserService.execute(userId);
  }

  @ApiOperation({ summary: 'Get current user CV as PDF' })
  @ApiResponse({ status: 200, description: 'User CV in PDF format' })
  @ApiProduces('application/pdf')
  @ApiBearerAuth('AccessToken')
  @UseGuards(JwtAuthGuard)
  @Get('me/cv')
  async getMyCv(
    @CurrentUser() userId: number,
    @Query() query: GenerateCvQueryDto,
    @Res() res: Response,
  ): Promise<void> {
    const { buffer, fileName } = await this.generateUserCvPdfService.executeById(userId, query);
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
    @Query() query: GenerateCvQueryDto,
    @Res() res: Response,
  ): Promise<void> {
    const { buffer, fileName } = await this.generateUserCvPdfService.executeByPublicUrl(publicUrl, query);
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
    @Query() query: GenerateCvQueryDto,
    @Res() res: Response,
  ): Promise<void> {
    const { buffer, fileName } = await this.generateUserCvPdfService.executeById(id, query);
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
