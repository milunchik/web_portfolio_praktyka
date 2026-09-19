import { Injectable } from '@nestjs/common';
import {
  UserRepository,
  CreateUserData,
  UserEntity,
} from '../repositories/user.repository';

@Injectable()
export class CreateUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(data: CreateUserData): Promise<UserEntity> {
    return this.userRepository.create(data);
  }
}
