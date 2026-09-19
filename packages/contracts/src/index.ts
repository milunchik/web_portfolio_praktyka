export interface HealthResponse {
  status: 'ok';
  service: 'api';
}

export type UserRole = 'admin' | 'user';

export interface SafeUser {
  id: number;
  email: string;
  fullName: string;
  description: string | null;
  publicUrl: string;
  role: UserRole | string;
  education?: any[];
  experience?: any[];
  medias?: any[];
  projects?: any[];
  languages?: any[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt?: Date;
  refreshTokenExpiresAt?: Date;
}

export interface AuthUserResponse {
  user: SafeUser;
  tokens: AuthTokens;
}

export interface Experience {
  id: number;
  userId: number;
  company: string;
  position: string;
  description: string;
  startDate: string | Date;
  endDate: string | Date | null;
  skills: string[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export type EducationDegree = 'bachelor' | 'master';

export interface Education {
  id: number;
  userId: number;
  title: string;
  degree: EducationDegree;
  startDate: string | Date;
  endDate: string | Date | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Project {
  id: number;
  userId: number;
  title: string;
  description: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
