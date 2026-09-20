import type { Project } from '@repo/contracts';

export type { Project };

export interface CreateProjectRequest {
  title: string;
  description: string;
}

export interface UpdateProjectRequest {
  title?: string;
  description?: string;
}
