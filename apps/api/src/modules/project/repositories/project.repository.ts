import { ProjectResDto } from '../dtos/res/project.res.dto';

export class ProjectEntity {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly title: string,
    public readonly description: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  toResponseDto(): ProjectResDto {
    return {
      id: this.id,
      userId: this.userId,
      title: this.title,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export interface CreateProjectData {
  title: string;
  description: string;
}

export interface UpdateProjectData {
  title?: string;
  description?: string;
}

export abstract class ProjectRepository {
  abstract findById(id: number): Promise<ProjectEntity | null>;
  abstract findByUserId(userId: number): Promise<ProjectEntity[]>;
  abstract findAll(conditions?: Record<string, unknown>): Promise<ProjectEntity[]>;
  abstract count(conditions?: Record<string, unknown>): Promise<number>;
  abstract create(userId: number, data: CreateProjectData): Promise<ProjectEntity>;
  abstract update(id: number, data: UpdateProjectData): Promise<ProjectEntity>;
  abstract delete(id: number): Promise<void>;
}
