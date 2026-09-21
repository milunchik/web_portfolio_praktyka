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
  about?: string | null;
  publicUrl: string;
  role: UserRole | string;
  fileName?: string | null;
  fileUrl?: string | null;
  avatarUrl?: string | null;
  cvOptions?: CvDisplayOptions | null;
  location?: string | null;
  website?: string | null;
  github?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  dribbble?: string | null;
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

export type LanguageLevel =
  | 'elementary'
  | 'pre_intermediate'
  | 'intermediate'
  | 'upper_intermediate'
  | 'advanced';

export interface Language {
  id: number;
  name: string;
  level: LanguageLevel;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Media {
  id: number;
  userId: number;
  url: string;
  fileName: string;
  mimeType: string;
  size: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CvDisplayOptions {
  showPhoto?: boolean;
  showContact?: boolean;
  showAbout?: boolean;
  showExperience?: boolean;
  showEducation?: boolean;
  showSkills?: boolean;
  showLanguages?: boolean;
  showProjects?: boolean;
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

export type AnalyticsEventType =
  | 'profile_view'
  | 'cv_download'
  | 'contact_click'
  | 'project_click'
  | 'social_link_click';

export type AnalyticsVisitorType = 'authenticated' | 'anonymous';

export type AnalyticsViewsPeriod = '7d' | '30d' | '90d';

export interface TrackAnalyticsEventDto {
  publicUrl?: string;
  portfolioOwnerId?: number;
  eventType: AnalyticsEventType;
  anonymousVisitorId?: string;
  projectId?: number;
  target?: string;
}

export interface AnalyticsVisitorBreakdown {
  authenticated: number;
  anonymous: number;
}

export interface AnalyticsSummaryDto {
  totalViews: number;
  viewsByVisitorType: AnalyticsVisitorBreakdown;
  uniqueVisitors: number;
  uniqueVisitorsByType: AnalyticsVisitorBreakdown;
  viewsToday: number;
  viewsThisWeek: number;
  viewsThisMonth: number;
  cvDownloads: number;
  contactClicks: number;
  projectClicks: number;
  socialLinkClicks: number;
}

export interface AnalyticsViewsPointDto {
  date: string;
  total: number;
  authenticated: number;
  anonymous: number;
}

export interface AnalyticsTopProjectDto {
  projectId: number;
  projectName: string;
  clicks: number;
}

export interface AnalyticsActivityItemDto {
  id: number;
  eventType: AnalyticsEventType;
  target: string | null;
  projectId: number | null;
  projectName: string | null;
  visitorType: AnalyticsVisitorType;
  createdAt: string | Date;
}
