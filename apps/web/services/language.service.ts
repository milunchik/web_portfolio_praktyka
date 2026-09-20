import { apiClient, ApiClient } from './api-client';
import {
  CreateLanguageRequest,
  Language,
  UpdateLanguageRequest,
} from '../types/language.types';

export class LanguageService {
  constructor(private readonly client: ApiClient = apiClient) {}

  async getMy(token?: string): Promise<Language[]> {
    return this.client.get<Language[]>('/language/me', { token });
  }

  async getByUserId(userId: number): Promise<Language[]> {
    return this.client.get<Language[]>(`/language/user/${userId}`);
  }

  async getById(id: number): Promise<Language> {
    return this.client.get<Language>(`/language/${id}`);
  }

  async create(data: CreateLanguageRequest, token?: string): Promise<Language> {
    return this.client.post<Language>('/language', data, { token });
  }

  async update(id: number, data: UpdateLanguageRequest, token?: string): Promise<Language> {
    return this.client.patch<Language>(`/language/${id}`, data, { token });
  }

  async delete(id: number, token?: string): Promise<void> {
    return this.client.delete<void>(`/language/${id}`, { token });
  }
}

export const languageService = new LanguageService();
