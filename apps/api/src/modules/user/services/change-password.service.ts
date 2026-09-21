import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { PasswordPort } from '../../../shared/domain/ports/password.port';
import { ChangePasswordReqDto } from '../dtos/req/change-password.req.dto';

@Injectable()
export class ChangePasswordService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordPort: PasswordPort,
  ) {}

  async execute(userId: number, dto: ChangePasswordReqDto): Promise<{ message: string }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await this.passwordPort.compare(dto.currentPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedPassword = await this.passwordPort.hash(dto.newPassword);
    await this.userRepository.update(userId, { password: hashedPassword });

    return { message: 'Password changed successfully' };
  }
}
