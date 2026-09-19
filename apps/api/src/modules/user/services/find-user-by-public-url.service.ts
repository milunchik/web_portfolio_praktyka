import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository, UserEntity } from '../repositories/user.repository';

@Injectable()
export class FindUserByPublicUrlService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(publicUrl: string): Promise<UserEntity> {
    const user = await this.userRepository.findByPublicUrl(publicUrl);
    if (!user) {
      throw new NotFoundException(`User with public url '${publicUrl}' not found`);
    }
    return user;
  }
}
