import { Injectable } from '@nestjs/common';
import { User, Role } from '@prisma/client';
import { PrismaService } from '../../../infrastructure';
import { StoragePort } from '../../../shared/domain/ports/storage.port';
import {
  UserRepository,
  CreateUserData,
  UpdateUserData,
  UserEntity,
  UserRole,
} from './user.repository';

type PrismaUserWithRelations = User & {
  education?: any[];
  experience?: any[];
  projects?: any[];
  medias?: any[];
  languages?: any[];
};

@Injectable()
export class PrismaUserRepository extends UserRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StoragePort,
  ) {
    super();
  }

  private toEntity(user: PrismaUserWithRelations): UserEntity {
    let avatarUrl: string | null = null;
    if (user.fileName) {
      avatarUrl =
        user.fileName.startsWith('http://') || user.fileName.startsWith('https://')
          ? user.fileName
          : this.storage.getPublicUrl(user.fileName);
    } else if (user.medias && user.medias.length > 0) {
      const lastMedia = user.medias[user.medias.length - 1];
      avatarUrl =
        lastMedia.url ||
        (lastMedia.fileName ? this.storage.getPublicUrl(lastMedia.fileName) : null);
    }

    return new UserEntity(
      user.id,
      user.email,
      user.fullName,
      user.description ?? null,
      user.password,
      user.publicUrl,
      user.role as UserRole,
      user.created_at,
      user.updated_at,
      user.education ?? [],
      user.experience ?? [],
      user.projects ?? [],
      user.medias ?? [],
      user.languages ?? [],
      user.fileName ?? null,
      avatarUrl,
      (user.cvOptions as any) ?? null,
      user.location ?? null,
      user.website ?? null,
      user.github ?? null,
      user.linkedin ?? null,
      user.twitter ?? null,
      user.dribbble ?? null,
      user.about ?? null,
    );
  }

  async findById(id: number): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: { id },
      include: {
        education: true,
        experience: true,
        projects: true,
        medias: true,
        languages: {
          include: {
            language: true,
          },
        },
      },
    });

    return user ? this.toEntity(user) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: { email },
      include: {
        education: true,
        experience: true,
        projects: true,
        medias: true,
        languages: {
          include: {
            language: true,
          },
        },
      },
    });

    return user ? this.toEntity(user) : null;
  }

  async findByPublicUrl(publicUrl: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: { publicUrl },
      include: {
        education: true,
        experience: true,
        projects: true,
        medias: true,
        languages: {
          include: {
            language: true,
          },
        },
      },
    });

    return user ? this.toEntity(user) : null;
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany({
      include: {
        education: true,
        experience: true,
        projects: true,
        medias: true,
        languages: {
          include: {
            language: true,
          },
        },
      },
    });

    return users.map((user) => this.toEntity(user));
  }

  async count(): Promise<number> {
    return this.prisma.user.count();
  }

  async create(data: CreateUserData): Promise<UserEntity> {
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        publicUrl: data.publicUrl,
        description: data.description ?? null,
        about: data.about ?? null,
        fileName: data.fileName ?? null,
        role: (data.role as Role) ?? Role.user,
        cvOptions: (data.cvOptions as any) ?? undefined,
        location: data.location ?? null,
        website: data.website ?? null,
        github: data.github ?? null,
        linkedin: data.linkedin ?? null,
        twitter: data.twitter ?? null,
        dribbble: data.dribbble ?? null,
      },
      include: {
        education: true,
        experience: true,
        projects: true,
        medias: true,
        languages: {
          include: {
            language: true,
          },
        },
      },
    });

    return this.toEntity(user);
  }

  async update(id: number, data: UpdateUserData): Promise<UserEntity> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...(data.email !== undefined && { email: data.email }),
        ...(data.password !== undefined && { password: data.password }),
        ...(data.fullName !== undefined && { fullName: data.fullName }),
        ...(data.publicUrl !== undefined && { publicUrl: data.publicUrl }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.about !== undefined && { about: data.about }),
        ...(data.fileName !== undefined && { fileName: data.fileName }),
        ...(data.role !== undefined && { role: data.role as Role }),
        ...(data.cvOptions !== undefined && { cvOptions: data.cvOptions as any }),
        ...(data.location !== undefined && { location: data.location }),
        ...(data.website !== undefined && { website: data.website }),
        ...(data.github !== undefined && { github: data.github }),
        ...(data.linkedin !== undefined && { linkedin: data.linkedin }),
        ...(data.twitter !== undefined && { twitter: data.twitter }),
        ...(data.dribbble !== undefined && { dribbble: data.dribbble }),
      },
      include: {
        education: true,
        experience: true,
        projects: true,
        medias: true,
        languages: {
          include: {
            language: true,
          },
        },
      },
    });

    return this.toEntity(user);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
