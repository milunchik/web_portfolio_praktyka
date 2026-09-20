import { apiClient, ApiClient } from './api-client';
import {
  CreateMediaRequest,
  Media,
  UpdateMediaRequest,
} from '../types/media.types';

export class MediaService {
  constructor(private readonly client: ApiClient = apiClient) {}

  async getMy(token?: string): Promise<Media[]> {
    return this.client.get<Media[]>('/media/me', { token });
  }

  async getByUserId(userId: number): Promise<Media[]> {
    return this.client.get<Media[]>(`/media/user/${userId}`);
  }

  async getById(id: number): Promise<Media> {
    return this.client.get<Media>(`/media/${id}`);
  }

  async upload(file: File, token?: string): Promise<Media> {
    const formData = new FormData();
    formData.append('file', file);
    return this.client.upload<Media>('/media/upload', formData, { token });
  }

  async create(data: CreateMediaRequest, token?: string): Promise<Media> {
    return this.client.post<Media>('/media', data, { token });
  }

  async update(id: number, data: UpdateMediaRequest, token?: string): Promise<Media> {
    return this.client.patch<Media>(`/media/${id}`, data, { token });
  }

  async delete(id: number, token?: string): Promise<void> {
    return this.client.delete<void>(`/media/${id}`, { token });
  }
}

export const mediaService = new MediaService();
