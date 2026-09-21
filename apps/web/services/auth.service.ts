import { apiClient, ApiClient } from './api-client';
import {
  AuthTokens,
  AuthUserResponse,
  RefreshTokensRequest,
  SignInRequest,
  SignUpRequest,
} from '../types/auth.types';

export class AuthService {
  constructor(private readonly client: ApiClient = apiClient) {}

  async signup(data: SignUpRequest): Promise<AuthUserResponse> {
    return this.client.post<AuthUserResponse>('/auth/signup', data);
  }

  async signin(data: SignInRequest): Promise<AuthTokens> {
    return this.client.post<AuthTokens>('/auth/signin', data);
  }

  async refreshTokens(data: RefreshTokensRequest): Promise<AuthTokens> {
    return this.client.post<AuthTokens>('/auth/refresh', data);
  }

  async logout(token?: string): Promise<{ message: string }> {
    return this.client.get<{ message: string }>('/auth/logout', { token });
  }

  async logoutAll(token?: string): Promise<{ message: string }> {
    return this.client.post<{ message: string }>('/auth/logout-all', {}, { token });
  }
}

export const authService = new AuthService();
