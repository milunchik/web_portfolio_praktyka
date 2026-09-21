import { UserRole } from '../../../shared/domain/types/user-role.type';
import { SafeUserResDto } from '../dtos/res/safe-user.res.dto';
import type { CvDisplayOptions } from '@repo/contracts';

export type { UserRole };

export class UserEntity {
  constructor(
    public readonly id: number,
    public readonly email: string,
    public readonly fullName: string,
    public readonly description: string | null,
    public readonly password: string,
    public readonly publicUrl: string,
    public readonly role: UserRole,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly education: any[] = [],
    public readonly experience: any[] = [],
    public readonly projects: any[] = [],
    public readonly medias: any[] = [],
    public readonly languages: any[] = [],
    public readonly fileName: string | null = null,
    public readonly avatarUrl: string | null = null,
    public readonly cvOptions: CvDisplayOptions | null = null,
    public readonly location: string | null = null,
    public readonly website: string | null = null,
    public readonly github: string | null = null,
    public readonly linkedin: string | null = null,
    public readonly twitter: string | null = null,
    public readonly dribbble: string | null = null,
    public readonly about: string | null = null,
  ) {}

  toSafeDto(): SafeUserResDto {
    return {
      id: this.id,
      email: this.email,
      fullName: this.fullName,
      description: this.description,
      about: this.about,
      publicUrl: this.publicUrl,
      role: this.role,
      fileName: this.fileName,
      avatarUrl: this.avatarUrl,
      fileUrl: this.avatarUrl,
      cvOptions: this.cvOptions,
      location: this.location,
      website: this.website,
      github: this.github,
      linkedin: this.linkedin,
      twitter: this.twitter,
      dribbble: this.dribbble,
      education: this.education,
      experience: this.experience,
      medias: this.medias,
      projects: this.projects,
      languages: this.languages,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export interface CreateUserData {
  email: string;
  password: string;
  fullName: string;
  role?: UserRole;
  publicUrl: string;
  description?: string | null;
  about?: string | null;
  fileName?: string | null;
  cvOptions?: CvDisplayOptions | null;
  location?: string | null;
  website?: string | null;
  github?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  dribbble?: string | null;
}

export interface UpdateUserData {
  email?: string;
  password?: string;
  fullName?: string;
  role?: UserRole;
  publicUrl?: string;
  description?: string | null;
  about?: string | null;
  fileName?: string | null;
  cvOptions?: CvDisplayOptions | null;
  location?: string | null;
  website?: string | null;
  github?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  dribbble?: string | null;
}

export abstract class UserRepository {
  abstract findById(id: number): Promise<UserEntity | null>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract findByPublicUrl(publicUrl: string): Promise<UserEntity | null>;
  abstract findAll(): Promise<UserEntity[]>;
  abstract count(): Promise<number>;
  abstract create(data: CreateUserData): Promise<UserEntity>;
  abstract update(id: number, data: UpdateUserData): Promise<UserEntity>;
  abstract delete(id: number): Promise<void>;
}
