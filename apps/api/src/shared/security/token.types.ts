import { UserRole } from '../domain/types/user-role.type';

export interface AccessTokenPayload {
  userId: number;
  email: string;
  role: UserRole;
}

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date;
};

export type AccessTokenPair = {
  accessToken: string;
  accessTokenExpiresAt: Date;
};

export type RefreshTokenPair = {
  refreshToken: string;
  refreshTokenExpiresAt: Date;
};
