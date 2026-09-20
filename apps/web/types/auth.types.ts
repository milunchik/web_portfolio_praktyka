import type { AuthTokens, AuthUserResponse, SafeUser } from '@repo/contracts';

export type { AuthTokens, AuthUserResponse, SafeUser };

export interface SignUpRequest {
  email: string;
  password: string;
  fullName: string;
  publicUrl: string;
  description?: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface RefreshTokensRequest {
  refreshToken: string;
}
