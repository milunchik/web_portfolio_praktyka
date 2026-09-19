import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RefreshReqDto } from '../dtos/req/refresh.req.dto';
import { TokenPort } from '../../../shared/domain/ports/token.port';
import { SessionRepository } from '../repositories/session.repository';
import { TokenPair } from '../../../shared/security/token.types';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly tokenPort: TokenPort,
    private readonly sessionRepository: SessionRepository,
  ) {}

  async execute(dto: RefreshReqDto): Promise<TokenPair> {
    const session = await this.sessionRepository.findByRefreshToken(
      dto.refreshToken,
    );
    if (!session)
      throw new UnauthorizedException('Session not found or revoked');

    if (
      session.refreshTokenExpiresAt &&
      session.refreshTokenExpiresAt < new Date()
    ) {
      await this.sessionRepository.deleteById(session.id);
      throw new UnauthorizedException('Refresh token expired');
    }

    const payload = this.tokenPort.verifyRefreshToken(dto.refreshToken);
    const tokens = this.tokenPort.generateTokenPair(payload);

    await this.sessionRepository.update(session.id, {
      refreshToken: tokens.refreshToken,
      accessToken: tokens.accessToken,
      accessTokenExpiresAt: tokens.accessTokenExpiresAt,
      refreshTokenExpiresAt: tokens.refreshTokenExpiresAt,
    });

    return tokens;
  }
}
