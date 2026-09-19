import { Injectable } from '@nestjs/common';
import { Prisma, Language } from '@prisma/client';
import { PrismaService } from '../../../infrastructure';
import {
  LanguageRepository,
  CreateLanguageData,
  UpdateLanguageData,
  LanguageEntity,
} from './language.repository';

@Injectable()
export class PrismaLanguageRepository extends LanguageRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  private toEntity(language: Language): LanguageEntity {
    return new LanguageEntity(
      language.id,
      language.name,
      language.level,
      language.createdAt,
      language.updatedAt,
    );
  }

  async findById(id: number): Promise<LanguageEntity | null> {
    const language = await this.prisma.language.findFirst({
      where: { id },
    });
    return language ? this.toEntity(language) : null;
  }

  async findByUserId(userId: number): Promise<LanguageEntity[]> {
    const relations = await this.prisma.languageUser.findMany({
      where: { userId },
      include: { language: true },
      orderBy: { createdAt: 'desc' },
    });
    return relations.map((rel) => this.toEntity(rel.language));
  }

  async isUserLanguage(userId: number, languageId: number): Promise<boolean> {
    const link = await this.prisma.languageUser.findFirst({
      where: { userId, languageId },
    });
    return Boolean(link);
  }

  async findAll(conditions?: Prisma.LanguageFindManyArgs): Promise<LanguageEntity[]> {
    const languages = await this.prisma.language.findMany(conditions);
    return languages.map((lang) => this.toEntity(lang));
  }

  async count(conditions?: Prisma.LanguageCountArgs): Promise<number> {
    return this.prisma.language.count(conditions);
  }

  async create(userId: number, data: CreateLanguageData): Promise<LanguageEntity> {
    const language = await this.prisma.language.create({
      data: {
        name: data.name,
        level: data.level,
        users: {
          create: {
            userId,
          },
        },
      },
    });
    return this.toEntity(language);
  }

  async update(id: number, data: UpdateLanguageData): Promise<LanguageEntity> {
    const language = await this.prisma.language.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.level !== undefined && { level: data.level }),
      },
    });
    return this.toEntity(language);
  }

  async delete(userId: number, id: number): Promise<void> {
    await this.prisma.languageUser.deleteMany({
      where: { userId, languageId: id },
    });
    await this.prisma.language.deleteMany({
      where: { id, users: { none: {} } },
    });
  }
}
