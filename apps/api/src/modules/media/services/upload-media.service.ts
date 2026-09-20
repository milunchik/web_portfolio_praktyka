import { BadRequestException, Injectable } from '@nestjs/common';
import { MediaRepository, MediaEntity } from '../repositories/media.repository';
import { StoragePort } from '../../../shared/domain/ports/storage.port';
import { UploadMediaReqDto } from '../dtos/req/upload-media.req.dto';

@Injectable()
export class UploadMediaService {
  constructor(
    private readonly mediaRepository: MediaRepository,
    private readonly storage: StoragePort,
  ) {}

  async execute(
    userId: number,
    file: Express.Multer.File,
    _dto?: UploadMediaReqDto,
  ): Promise<MediaEntity> {
    if (!file || !file.buffer) {
      throw new BadRequestException('File is required for upload');
    }

    const originalName = file.originalname || 'file';
    const sanitizedFilename = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `${userId}/${Date.now()}-${sanitizedFilename}`;

    const url = await this.storage.upload(filePath, file.buffer, {
      contentType: file.mimetype,
    });

    return this.mediaRepository.create(userId, {
      url,
      fileName: filePath,
      mimeType: file.mimetype || 'application/octet-stream',
      size: file.size || file.buffer.length,
    });
  }
}
