import { LanguageLevel } from '@prisma/client';
import { LanguageResDto } from '../dtos/res/language.res.dto';

export type { LanguageLevel };

export class LanguageEntity {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly level: LanguageLevel,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  toResponseDto(): LanguageResDto {
    return {
      id: this.id,
      name: this.name,
      level: this.level,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export interface CreateLanguageData {
  name: string;
  level: LanguageLevel;
}

export interface UpdateLanguageData {
  name?: string;
  level?: LanguageLevel;
}

export abstract class LanguageRepository {
  abstract findById(id: number): Promise<LanguageEntity | null>;
  abstract findByUserId(userId: number): Promise<LanguageEntity[]>;
  abstract isUserLanguage(userId: number, languageId: number): Promise<boolean>;
  abstract findAll(conditions?: Record<string, unknown>): Promise<LanguageEntity[]>;
  abstract count(conditions?: Record<string, unknown>): Promise<number>;
  abstract create(userId: number, data: CreateLanguageData): Promise<LanguageEntity>;
  abstract update(id: number, data: UpdateLanguageData): Promise<LanguageEntity>;
  abstract delete(userId: number, id: number): Promise<void>;
}
