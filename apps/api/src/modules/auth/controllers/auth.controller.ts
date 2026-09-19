import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SigninReqDto } from '../dtos/req';
import { SignupReqDto } from '../dtos/req';
import { RefreshReqDto } from '../dtos/req';
import { SigninService } from '../services';
import { SignupService } from '../services';
import { RefreshTokenService } from '../services';
import { LogoutService } from '../services';
import { JwtAuthGuard } from '../../../shared/guards';
import { CurrentUser } from '../../../shared/decorators';
import { TokenPair } from '../../../shared/security';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly signinService: SigninService,
    private readonly signupService: SignupService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly logoutService: LogoutService,
  ) {}

  @ApiOperation({ summary: 'Sign in with email and password' })
  @Post('signin')
  async signin(@Body() dto: SigninReqDto): Promise<TokenPair> {
    return this.signinService.execute(dto);
  }

  @ApiOperation({ summary: 'Register a new user account' })
  @Post('signup')
  async signup(@Body() dto: SignupReqDto): Promise<TokenPair> {
    return this.signupService.execute(dto);
  }

  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @Post('refresh')
  async refresh(@Body() dto: RefreshReqDto): Promise<TokenPair> {
    return this.refreshTokenService.execute(dto);
  }

  @ApiOperation({ summary: 'Logout and revoke all sessions' })
  @Get('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('AccessToken')
  async logout(@CurrentUser() userId: number) {
    return this.logoutService.execute(userId);
  }
}
