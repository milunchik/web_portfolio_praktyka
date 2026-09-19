import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository, UserEntity, UpdateUserData } from '../repositories/user.repository';

@Injectable()
export class UpdateUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: number, data: UpdateUserData): Promise<UserEntity> {
    const existing = await this.userRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('User not found');
    }
    return this.userRepository.update(id, data);
  }
}
