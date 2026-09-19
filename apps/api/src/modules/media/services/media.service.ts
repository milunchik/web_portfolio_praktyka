import { Injectable } from '@nestjs/common';
import { CreateMediaService } from './create-media.service';
import { UploadMediaService } from './upload-media.service';
import { FindMediaByIdService } from './find-media-by-id.service';
import { FindMediaByUserService } from './find-media-by-user.service';
import { UpdateMediaService } from './update-media.service';
import { DeleteMediaService } from './delete-media.service';
import { CreateMediaReqDto, UpdateMediaReqDto, UploadMediaReqDto } from '../dtos/req';
import { MediaEntity } from '../repositories/media.repository';

@Injectable()
export class MediaService {
  constructor(
    private readonly createMediaService: CreateMediaService,
    private readonly uploadMediaService: UploadMediaService,
    private readonly findMediaByIdService: FindMediaByIdService,
    private readonly findMediaByUserService: FindMediaByUserService,
    private readonly updateMediaService: UpdateMediaService,
    private readonly deleteMediaService: DeleteMediaService,
  ) {}

  async create(userId: number, dto: CreateMediaReqDto): Promise<MediaEntity> {
    return this.createMediaService.execute(userId, dto);
  }

  async upload(
    userId: number,
    file: Express.Multer.File,
    dto?: UploadMediaReqDto,
  ): Promise<MediaEntity> {
    return this.uploadMediaService.execute(userId, file, dto);
  }

  async findById(id: number): Promise<MediaEntity> {
    return this.findMediaByIdService.execute(id);
  }

  async findByUserId(userId: number): Promise<MediaEntity[]> {
    return this.findMediaByUserService.execute(userId);
  }

  async update(userId: number, id: number, dto: UpdateMediaReqDto): Promise<MediaEntity> {
    return this.updateMediaService.execute(userId, id, dto);
  }

  async delete(userId: number, id: number): Promise<void> {
    return this.deleteMediaService.execute(userId, id);
  }
}
