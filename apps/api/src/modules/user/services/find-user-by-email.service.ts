import { Injectable } from '@nestjs/common';
import { UserRepository, UserEntity } from '../repositories/user.repository';

@Injectable()
export class FindUserByEmailService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string): Promise<UserEntity | null> {
    return this.userRepository.findByEmail(email);
  }
}
