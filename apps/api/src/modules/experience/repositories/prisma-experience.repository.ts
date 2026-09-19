import { Injectable } from '@nestjs/common';
import { Prisma, Experience } from '@prisma/client';
import { PrismaService } from '../../../infrastructure';
import {
  ExperienceRepository,
  CreateExperienceData,
  UpdateExperienceData,
  ExperienceEntity,
} from './experience.repository';

@Injectable()
export class PrismaExperienceRepository extends ExperienceRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  private toEntity(experience: Experience): ExperienceEntity {
    return new ExperienceEntity(
      experience.id,
      experience.userId,
      experience.company,
      experience.position,
      experience.description,
      experience.startDate,
      experience.endDate,
      experience.skills,
      experience.createdAt,
      experience.updatedAt,
    );
  }

  async findById(id: number): Promise<ExperienceEntity | null> {
    const experience = await this.prisma.experience.findFirst({
      where: { id },
    });
    return experience ? this.toEntity(experience) : null;
  }

  async findByUserId(userId: number): Promise<ExperienceEntity[]> {
    const experiences = await this.prisma.experience.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' },
    });
    return experiences.map((exp) => this.toEntity(exp));
  }

  async findAll(conditions?: Prisma.ExperienceFindManyArgs): Promise<ExperienceEntity[]> {
    const experiences = await this.prisma.experience.findMany(conditions);
    return experiences.map((exp) => this.toEntity(exp));
  }

  async count(conditions?: Prisma.ExperienceCountArgs): Promise<number> {
    return this.prisma.experience.count(conditions);
  }

  async create(userId: number, data: CreateExperienceData): Promise<ExperienceEntity> {
    const experience = await this.prisma.experience.create({
      data: {
        userId,
        company: data.company,
        position: data.position,
        description: data.description,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        skills: data.skills ?? [],
      },
    });
    return this.toEntity(experience);
  }

  async update(id: number, data: UpdateExperienceData): Promise<ExperienceEntity> {
    const experience = await this.prisma.experience.update({
      where: { id },
      data: {
        ...(data.company !== undefined && { company: data.company }),
        ...(data.position !== undefined && { position: data.position }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.startDate !== undefined && { startDate: new Date(data.startDate) }),
        ...(data.endDate !== undefined && {
          endDate: data.endDate ? new Date(data.endDate) : null,
        }),
        ...(data.skills !== undefined && { skills: data.skills }),
      },
    });
    return this.toEntity(experience);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.experience.delete({
      where: { id },
    });
  }
}
