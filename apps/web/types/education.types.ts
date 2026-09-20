import type { Education, EducationDegree } from '@repo/contracts';

export type { Education, EducationDegree };

export interface CreateEducationRequest {
  title: string;
  degree?: EducationDegree;
  startDate: string | Date;
  endDate?: string | Date | null;
}

export interface UpdateEducationRequest {
  title?: string;
  degree?: EducationDegree;
  startDate?: string | Date;
  endDate?: string | Date | null;
}
