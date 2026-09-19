import { Injectable } from '@nestjs/common';
import { Prisma, Education, EducationDegree } from '@prisma/client';
import { PrismaService } from '../../../infrastructure';
import {
  EducationRepository,
  CreateEducationData,
  UpdateEducationData,
  EducationEntity,
} from './education.repository';

@Injectable()
export class PrismaEducationRepository extends EducationRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  private toEntity(education: Education): EducationEntity {
    return new EducationEntity(
      education.id,
      education.userId,
      education.title,
      education.degree,
      education.startDate,
      education.endDate,
      education.createdAt,
      education.updatedAt,
    );
  }

  async findById(id: number): Promise<EducationEntity | null> {
    const education = await this.prisma.education.findFirst({
      where: { id },
    });
    return education ? this.toEntity(education) : null;
  }

  async findByUserId(userId: number): Promise<EducationEntity[]> {
    const educations = await this.prisma.education.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' },
    });
    return educations.map((edu) => this.toEntity(edu));
  }

  async findAll(conditions?: Prisma.EducationFindManyArgs): Promise<EducationEntity[]> {
    const educations = await this.prisma.education.findMany(conditions);
    return educations.map((edu) => this.toEntity(edu));
  }

  async count(conditions?: Prisma.EducationCountArgs): Promise<number> {
    return this.prisma.education.count(conditions);
  }

  async create(userId: number, data: CreateEducationData): Promise<EducationEntity> {
    const education = await this.prisma.education.create({
      data: {
        userId,
        title: data.title,
        degree: data.degree ?? EducationDegree.bachelor,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
    });
    return this.toEntity(education);
  }

  async update(id: number, data: UpdateEducationData): Promise<EducationEntity> {
    const education = await this.prisma.education.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.degree !== undefined && { degree: data.degree }),
        ...(data.startDate !== undefined && { startDate: new Date(data.startDate) }),
        ...(data.endDate !== undefined && {
          endDate: data.endDate ? new Date(data.endDate) : null,
        }),
      },
    });
    return this.toEntity(education);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.education.delete({
      where: { id },
    });
  }
}
