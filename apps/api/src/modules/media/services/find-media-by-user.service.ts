import { Injectable } from '@nestjs/common';
import { MediaRepository, MediaEntity } from '../repositories/media.repository';

@Injectable()
export class FindMediaByUserService {
  constructor(private readonly mediaRepository: MediaRepository) {}

  async execute(userId: number): Promise<MediaEntity[]> {
    return this.mediaRepository.findByUserId(userId);
  }
}
