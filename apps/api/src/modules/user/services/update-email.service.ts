import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository, UserEntity } from '../repositories/user.repository';
import { UpdateEmailReqDto } from '../dtos/req/update-email.req.dto';

@Injectable()
export class UpdateEmailService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: number, dto: UpdateEmailReqDto): Promise<UserEntity> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const normalizedEmail = dto.email.trim().toLowerCase();
    if (user.email.toLowerCase() === normalizedEmail) {
      return user;
    }

    const existingWithEmail = await this.userRepository.findByEmail(normalizedEmail);
    if (existingWithEmail && existingWithEmail.id !== userId) {
      throw new ConflictException('Email is already taken');
    }

    return this.userRepository.update(userId, { email: normalizedEmail });
  }
}
