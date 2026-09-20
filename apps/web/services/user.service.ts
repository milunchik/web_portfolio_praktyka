import { apiClient, ApiClient } from './api-client';
import { SafeUser, UpdateUserRequest } from '../types/user.types';
import type { CvDisplayOptions } from '@repo/contracts';

export class UserService {
  constructor(private readonly client: ApiClient = apiClient) {}

  async getMe(token?: string): Promise<SafeUser> {
    return this.client.get<SafeUser>('/user/me', { token });
  }

  async updateMe(data: UpdateUserRequest, token?: string): Promise<SafeUser> {
    return this.client.patch<SafeUser>('/user/me', data, { token });
  }

  async getById(id: number): Promise<SafeUser> {
    return this.client.get<SafeUser>(`/user/${id}`);
  }

  async getByPublicUrl(publicUrl: string): Promise<SafeUser> {
    return this.client.get<SafeUser>(`/user/public/${encodeURIComponent(publicUrl)}`);
  }

  async getCvBlobMe(options?: CvDisplayOptions, token?: string): Promise<Blob> {
    return this.client.getBlob('/user/me/cv', { params: options as any, token });
  }

  async getCvBlobById(id: number, options?: CvDisplayOptions): Promise<Blob> {
    return this.client.getBlob(`/user/${id}/cv`, { params: options as any });
  }

  async getCvBlobByPublicUrl(publicUrl: string, options?: CvDisplayOptions): Promise<Blob> {
    return this.client.getBlob(`/user/public/${encodeURIComponent(publicUrl)}/cv`, { params: options as any });
  }
}

export const userService = new UserService();
