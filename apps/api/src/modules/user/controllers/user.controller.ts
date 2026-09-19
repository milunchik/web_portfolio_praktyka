import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  FindUserByIdService,
  FindUserByPublicUrlService,
  UpdateUserService,
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

  @ApiOperation({ summary: 'Get public user profile by public URL' })
  @ApiResponse({ status: 200, type: SafeUserResDto })
  @Get('public/:publicUrl')
  async getByPublicUrl(
    @Param('publicUrl') publicUrl: string,
  ): Promise<SafeUserResDto> {
    const user = await this.findUserByPublicUrl.execute(publicUrl);
    return user.toSafeDto();
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
