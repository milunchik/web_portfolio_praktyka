import { ExperienceResDto } from '../dtos/res/experience.res.dto';

export class ExperienceEntity {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly company: string,
    public readonly position: string,
    public readonly description: string,
    public readonly startDate: Date,
    public readonly endDate: Date | null,
    public readonly skills: string[] = [],
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  toResponseDto(): ExperienceResDto {
    return {
      id: this.id,
      userId: this.userId,
      company: this.company,
      position: this.position,
      description: this.description,
      startDate: this.startDate,
      endDate: this.endDate,
      skills: this.skills,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export interface CreateExperienceData {
  company: string;
  position: string;
  description: string;
  startDate: string | Date;
  endDate?: string | Date | null;
  skills?: string[];
}

export interface UpdateExperienceData {
  company?: string;
  position?: string;
  description?: string;
  startDate?: string | Date;
  endDate?: string | Date | null;
  skills?: string[];
}

export abstract class ExperienceRepository {
  abstract findById(id: number): Promise<ExperienceEntity | null>;
  abstract findByUserId(userId: number): Promise<ExperienceEntity[]>;
  abstract findAll(conditions?: Record<string, unknown>): Promise<ExperienceEntity[]>;
  abstract count(conditions?: Record<string, unknown>): Promise<number>;
  abstract create(userId: number, data: CreateExperienceData): Promise<ExperienceEntity>;
  abstract update(id: number, data: UpdateExperienceData): Promise<ExperienceEntity>;
  abstract delete(id: number): Promise<void>;
}
