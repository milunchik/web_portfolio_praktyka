import { apiClient, ApiClient } from './api-client';
import { SafeUser, UpdateUserRequest } from '../types/user.types';

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

  async getCvBlobMe(token?: string): Promise<Blob> {
    return this.client.getBlob('/user/me/cv', { token });
  }

  async getCvBlobById(id: number): Promise<Blob> {
    return this.client.getBlob(`/user/${id}/cv`);
  }

  async getCvBlobByPublicUrl(publicUrl: string): Promise<Blob> {
    return this.client.getBlob(`/user/public/${encodeURIComponent(publicUrl)}/cv`);
  }
}

export const userService = new UserService();
