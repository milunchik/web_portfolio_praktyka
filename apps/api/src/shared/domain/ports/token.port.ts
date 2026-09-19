import { AccessTokenPayload, TokenPair } from '../../security';

export abstract class TokenPort {
  abstract generateTokenPair(
    payload: AccessTokenPayload & { iat?: number; exp?: number },
  ): TokenPair;
  abstract verifyAccessToken(token: string): AccessTokenPayload;
  abstract verifyRefreshToken(
    token: string,
  ): AccessTokenPayload & { iat?: number; exp?: number };
}
