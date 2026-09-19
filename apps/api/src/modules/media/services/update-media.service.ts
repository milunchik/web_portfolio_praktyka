import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { MediaRepository, MediaEntity } from '../repositories/media.repository';
import { UpdateMediaReqDto } from '../dtos/req/update-media.req.dto';

@Injectable()
export class UpdateMediaService {
  constructor(private readonly mediaRepository: MediaRepository) {}

  async execute(
    userId: number,
    id: number,
    dto: UpdateMediaReqDto,
  ): Promise<MediaEntity> {
    const media = await this.mediaRepository.findById(id);
    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }

    if (media.userId !== userId) {
      throw new ForbiddenException('You do not have permission to update this media record');
    }

    return this.mediaRepository.update(id, dto);
  }
}
