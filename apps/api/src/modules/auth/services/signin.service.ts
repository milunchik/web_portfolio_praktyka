import { BadRequestException, Injectable } from '@nestjs/common';
import { SigninReqDto } from '../dtos/req/signin.req.dto';
import { FindUserByEmailService } from '../../user/services/find-user-by-email.service';
import { PasswordPort } from '../../../shared/domain/ports/password.port';
import { TokenPort } from '../../../shared/domain/ports/token.port';
import { SessionRepository } from '../repositories/session.repository';
import { TokenPair } from '../../../shared/security/token.types';

@Injectable()
export class SigninService {
  constructor(
    private readonly findUserByEmail: FindUserByEmailService,
    private readonly passwordPort: PasswordPort,
    private readonly tokenPort: TokenPort,
    private readonly sessionRepository: SessionRepository,
  ) {}

  async execute(dto: SigninReqDto): Promise<TokenPair> {
    const user = await this.findUserByEmail.execute(dto.email);

    if (!user) throw new BadRequestException('Invalid credentials');

    const isMatch = await this.passwordPort.compare(
      dto.password,
      user.password,
    );
    if (!isMatch) throw new BadRequestException('Invalid credentials');

    const tokens = this.tokenPort.generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await this.sessionRepository.create({
      userId: user.id,
      refreshToken: tokens.refreshToken,
      accessToken: tokens.accessToken,
      accessTokenExpiresAt: tokens.accessTokenExpiresAt,
      refreshTokenExpiresAt: tokens.refreshTokenExpiresAt,
    });

    return tokens;
  }
}
