import { Injectable } from '@nestjs/common';
import { Prisma, Project } from '@prisma/client';
import { PrismaService } from '../../../infrastructure';
import {
  ProjectRepository,
  CreateProjectData,
  UpdateProjectData,
  ProjectEntity,
} from './project.repository';

@Injectable()
export class PrismaProjectRepository extends ProjectRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  private toEntity(project: Project): ProjectEntity {
    return new ProjectEntity(
      project.id,
      project.userId,
      project.title,
      project.description,
      project.createdAt,
      project.updatedAt,
    );
  }

  async findById(id: number): Promise<ProjectEntity | null> {
    const project = await this.prisma.project.findFirst({
      where: { id },
    });
    return project ? this.toEntity(project) : null;
  }

  async findByUserId(userId: number): Promise<ProjectEntity[]> {
    const projects = await this.prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return projects.map((proj) => this.toEntity(proj));
  }

  async findAll(conditions?: Prisma.ProjectFindManyArgs): Promise<ProjectEntity[]> {
    const projects = await this.prisma.project.findMany(conditions);
    return projects.map((proj) => this.toEntity(proj));
  }

  async count(conditions?: Prisma.ProjectCountArgs): Promise<number> {
    return this.prisma.project.count(conditions);
  }

  async create(userId: number, data: CreateProjectData): Promise<ProjectEntity> {
    const project = await this.prisma.project.create({
      data: {
        userId,
        title: data.title,
        description: data.description,
      },
    });
    return this.toEntity(project);
  }

  async update(id: number, data: UpdateProjectData): Promise<ProjectEntity> {
    const project = await this.prisma.project.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
      },
    });
    return this.toEntity(project);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.project.delete({
      where: { id },
    });
  }
}
