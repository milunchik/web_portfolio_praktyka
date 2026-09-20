import { apiClient, ApiClient } from './api-client';
import {
  CreateExperienceRequest,
  Experience,
  UpdateExperienceRequest,
} from '../types/experience.types';

export class ExperienceService {
  constructor(private readonly client: ApiClient = apiClient) {}

  async getMy(token?: string): Promise<Experience[]> {
    return this.client.get<Experience[]>('/experience/me', { token });
  }

  async getByUserId(userId: number): Promise<Experience[]> {
    return this.client.get<Experience[]>(`/experience/user/${userId}`);
  }

  async getById(id: number): Promise<Experience> {
    return this.client.get<Experience>(`/experience/${id}`);
  }

  async create(data: CreateExperienceRequest, token?: string): Promise<Experience> {
    return this.client.post<Experience>('/experience', data, { token });
  }

  async update(id: number, data: UpdateExperienceRequest, token?: string): Promise<Experience> {
    return this.client.patch<Experience>(`/experience/${id}`, data, { token });
  }

  async delete(id: number, token?: string): Promise<void> {
    return this.client.delete<void>(`/experience/${id}`, { token });
  }
}

export const experienceService = new ExperienceService();
