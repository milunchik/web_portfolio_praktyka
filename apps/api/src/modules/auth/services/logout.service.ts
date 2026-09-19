import { Injectable } from '@nestjs/common';
import { SessionRepository } from '../repositories/session.repository';

@Injectable()
export class LogoutService {
  constructor(private readonly sessionRepository: SessionRepository) {}

  async execute(userId: number): Promise<{ message: string }> {
    await this.sessionRepository.deleteAllByUserId(userId);
    return { message: 'Successfully logged out' };
  }
}
