import { EducationDegree } from '@prisma/client';
import { EducationResDto } from '../dtos';

export type { EducationDegree };

export class EducationEntity {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly title: string,
    public readonly degree: EducationDegree,
    public readonly startDate: Date,
    public readonly endDate: Date | null,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  toResponseDto(): EducationResDto {
    return {
      id: this.id,
      userId: this.userId,
      title: this.title,
      degree: this.degree,
      startDate: this.startDate,
      endDate: this.endDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export interface CreateEducationData {
  title: string;
  degree?: EducationDegree;
  startDate: string | Date;
  endDate?: string | Date | null;
}

export interface UpdateEducationData {
  title?: string;
  degree?: EducationDegree;
  startDate?: string | Date;
  endDate?: string | Date | null;
}

export abstract class EducationRepository {
  abstract findById(id: number): Promise<EducationEntity | null>;
  abstract findByUserId(userId: number): Promise<EducationEntity[]>;
  abstract findAll(conditions?: Record<string, unknown>): Promise<EducationEntity[]>;
  abstract count(conditions?: Record<string, unknown>): Promise<number>;
  abstract create(userId: number, data: CreateEducationData): Promise<EducationEntity>;
  abstract update(id: number, data: UpdateEducationData): Promise<EducationEntity>;
  abstract delete(id: number): Promise<void>;
}
