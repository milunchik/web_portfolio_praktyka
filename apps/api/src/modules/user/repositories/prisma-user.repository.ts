import { Injectable } from '@nestjs/common';
import { User, Role } from '@prisma/client';
import { PrismaService } from '../../../infrastructure';
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
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  private toEntity(user: PrismaUserWithRelations): UserEntity {
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
        role: (data.role as Role) ?? Role.user,
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
        ...(data.role !== undefined && { role: data.role as Role }),
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
