import type { Experience } from '@repo/contracts';

export type { Experience };

export interface CreateExperienceRequest {
  company: string;
  position: string;
  description: string;
  startDate: string | Date;
  endDate?: string | Date | null;
  skills?: string[];
}

export interface UpdateExperienceRequest {
  company?: string;
  position?: string;
  description?: string;
  startDate?: string | Date;
  endDate?: string | Date | null;
  skills?: string[];
}
