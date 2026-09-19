import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository, UserEntity } from '../repositories/user.repository';

@Injectable()
export class FindUserByIdService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
