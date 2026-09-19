import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import {
  AccessTokenPayload,
  TokenPair,
  AccessTokenPair,
  RefreshTokenPair,
} from './token.types';
import { AppConfigService } from '../../infrastructure/config/config.service';
import ms, { StringValue } from 'ms';
import { TokenPort } from '../domain/ports';

@Injectable()
export class TokenService extends TokenPort {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessSecretLife: StringValue;
  private readonly refreshSecretLife: StringValue;

  constructor(private readonly config: AppConfigService) {
    super();
    const { secret, refreshSecret, secretLife, refreshSecretLife } =
      this.config.auth;

    this.accessSecret = secret;
    this.refreshSecret = refreshSecret;
    this.accessSecretLife = secretLife as StringValue;
    this.refreshSecretLife = refreshSecretLife as StringValue;
  }

  private removeJwtDates(
    payload: AccessTokenPayload & { iat?: number; exp?: number },
  ): AccessTokenPayload {
    const { iat, exp, ...cleanPayload } = payload;
    console.log(iat);
    console.log(exp);

    return cleanPayload;
  }

  generateAccessToken(payload: AccessTokenPayload): AccessTokenPair {
    const accessLifeMs = ms(this.accessSecretLife);
    const expiresAt = new Date(Date.now() + accessLifeMs);

    return {
      accessToken: jwt.sign(payload, this.accessSecret, {
        expiresIn: this.accessSecretLife,
      }),
      accessTokenExpiresAt: expiresAt,
    };
  }

  generateRefreshToken(payload: AccessTokenPayload): RefreshTokenPair {
    const refreshLifeMs = ms(this.refreshSecretLife);
    const expiresAt = new Date(Date.now() + refreshLifeMs);

    return {
      refreshToken: jwt.sign(payload, this.refreshSecret, {
        expiresIn: this.refreshSecretLife,
      }),
      refreshTokenExpiresAt: expiresAt,
    };
  }

  generateTokenPair(
    payload: AccessTokenPayload & { iat?: number; exp?: number },
  ): TokenPair {
    const cleanPayload = this.removeJwtDates(payload);

    const accessData = this.generateAccessToken(cleanPayload);
    const refreshData = this.generateRefreshToken(cleanPayload);

    return {
      ...accessData,
      ...refreshData,
    };
  }

  verifyAccessToken(token: string): AccessTokenPayload {
    return jwt.verify(token, this.accessSecret) as AccessTokenPayload;
  }

  verifyRefreshToken(
    token: string,
  ): AccessTokenPayload & { iat?: number; exp?: number } {
    return jwt.verify(token, this.refreshSecret) as AccessTokenPayload & {
      iat?: number;
      exp?: number;
    };
  }
}
