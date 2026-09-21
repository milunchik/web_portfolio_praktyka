import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository, UserEntity, UpdateUserData } from '../repositories/user.repository';

@Injectable()
export class UpdateUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: number, data: UpdateUserData): Promise<UserEntity> {
    const existing = await this.userRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('User not found');
    }

    if (data.email) {
      const normalizedEmail = data.email.trim().toLowerCase();
      if (existing.email.toLowerCase() !== normalizedEmail) {
        const existingWithEmail = await this.userRepository.findByEmail(normalizedEmail);
        if (existingWithEmail && existingWithEmail.id !== id) {
          throw new ConflictException('Email is already taken');
        }
      }
      data.email = normalizedEmail;
    }

    return this.userRepository.update(id, data);
  }
}
