import { apiClient, ApiClient } from './api-client';
import {
  CreateEducationRequest,
  Education,
  UpdateEducationRequest,
} from '../types/education.types';

export class EducationService {
  constructor(private readonly client: ApiClient = apiClient) {}

  async getMy(token?: string): Promise<Education[]> {
    return this.client.get<Education[]>('/education/me', { token });
  }

  async getByUserId(userId: number): Promise<Education[]> {
    return this.client.get<Education[]>(`/education/user/${userId}`);
  }

  async getById(id: number): Promise<Education> {
    return this.client.get<Education>(`/education/${id}`);
  }

  async create(data: CreateEducationRequest, token?: string): Promise<Education> {
    return this.client.post<Education>('/education', data, { token });
  }

  async update(id: number, data: UpdateEducationRequest, token?: string): Promise<Education> {
    return this.client.patch<Education>(`/education/${id}`, data, { token });
  }

  async delete(id: number, token?: string): Promise<void> {
    return this.client.delete<void>(`/education/${id}`, { token });
  }
}

export const educationService = new EducationService();
