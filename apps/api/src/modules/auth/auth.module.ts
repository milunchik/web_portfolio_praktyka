import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { SessionRepository } from './repositories/session.repository';
import { PrismaSessionRepository } from './repositories/prisma-session.repository';
import { SigninService } from './services/signin.service';
import { SignupService } from './services/signup.service';
import { RefreshTokenService } from './services/refresh-token.service';
import { LogoutService } from './services/logout.service';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [UserModule],
  providers: [
    { provide: SessionRepository, useClass: PrismaSessionRepository },
    SigninService,
    SignupService,
    RefreshTokenService,
    LogoutService,
  ],
  controllers: [AuthController],
  exports: [SigninService, SignupService, RefreshTokenService, LogoutService],
})
export class AuthModule {}
