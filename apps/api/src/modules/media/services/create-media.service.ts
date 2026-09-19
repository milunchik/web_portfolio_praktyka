import { Injectable } from '@nestjs/common';
import { MediaRepository, MediaEntity } from '../repositories/media.repository';
import { CreateMediaReqDto } from '../dtos/req/create-media.req.dto';

@Injectable()
export class CreateMediaService {
  constructor(private readonly mediaRepository: MediaRepository) {}

  async execute(userId: number, dto: CreateMediaReqDto): Promise<MediaEntity> {
    return this.mediaRepository.create(userId, dto);
  }
}
