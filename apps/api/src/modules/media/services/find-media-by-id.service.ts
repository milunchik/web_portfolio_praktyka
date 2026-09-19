import { Injectable, NotFoundException } from '@nestjs/common';
import { MediaRepository, MediaEntity } from '../repositories/media.repository';

@Injectable()
export class FindMediaByIdService {
  constructor(private readonly mediaRepository: MediaRepository) {}

  async execute(id: number): Promise<MediaEntity> {
    const media = await this.mediaRepository.findById(id);
    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }
    return media;
  }
}
