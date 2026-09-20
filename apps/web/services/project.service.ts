import { apiClient, ApiClient } from './api-client';
import {
  CreateProjectRequest,
  Project,
  UpdateProjectRequest,
} from '../types/project.types';

export class ProjectService {
  constructor(private readonly client: ApiClient = apiClient) {}

  async getMy(token?: string): Promise<Project[]> {
    return this.client.get<Project[]>('/project/me', { token });
  }

  async getByUserId(userId: number): Promise<Project[]> {
    return this.client.get<Project[]>(`/project/user/${userId}`);
  }

  async getById(id: number): Promise<Project> {
    return this.client.get<Project>(`/project/${id}`);
  }

  async create(data: CreateProjectRequest, token?: string): Promise<Project> {
    return this.client.post<Project>('/project', data, { token });
  }

  async update(id: number, data: UpdateProjectRequest, token?: string): Promise<Project> {
    return this.client.patch<Project>(`/project/${id}`, data, { token });
  }

  async delete(id: number, token?: string): Promise<void> {
    return this.client.delete<void>(`/project/${id}`, { token });
  }
}

export const projectService = new ProjectService();
