import { UserRole } from '../../../shared/domain/types/user-role.type';

export type { UserRole };

export class UserEntity {
  constructor(
    public readonly id: number,
    public readonly email: string,
    public readonly password: string,
    public readonly name: string,
    public readonly role: UserRole,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface UpdateUserData {
  email?: string;
  password?: string;
  name?: string;
  role?: UserRole;
}

export abstract class UserRepository {
  abstract findById(id: number): Promise<UserEntity | null>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract findAll(): Promise<UserEntity[]>;
  abstract count(): Promise<number>;
  abstract create(data: CreateUserData): Promise<UserEntity>;
  abstract update(id: number, data: UpdateUserData): Promise<UserEntity>;
  abstract delete(id: number): Promise<void>;
}
