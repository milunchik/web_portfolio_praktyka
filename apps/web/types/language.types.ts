import type { Language, LanguageLevel } from '@repo/contracts';

export type { Language, LanguageLevel };

export interface CreateLanguageRequest {
  name: string;
  level: LanguageLevel;
}

export interface UpdateLanguageRequest {
  name?: string;
  level?: LanguageLevel;
}
