import { Module } from '@nestjs/common';
import { MediaController } from './controllers/media.controller';
import { MediaRepository } from './repositories/media.repository';
import { PrismaMediaRepository } from './repositories/prisma-media.repository';
import {
  CreateMediaService,
  UploadMediaService,
  FindMediaByIdService,
  FindMediaByUserService,
  UpdateMediaService,
  DeleteMediaService,
  MediaService,
} from './services';

@Module({
  controllers: [MediaController],
  providers: [
    { provide: MediaRepository, useClass: PrismaMediaRepository },
    CreateMediaService,
    UploadMediaService,
    FindMediaByIdService,
    FindMediaByUserService,
    UpdateMediaService,
    DeleteMediaService,
    MediaService,
  ],
  exports: [
    MediaRepository,
    CreateMediaService,
    UploadMediaService,
    FindMediaByIdService,
    FindMediaByUserService,
    UpdateMediaService,
    DeleteMediaService,
    MediaService,
  ],
})
export class MediaModule {}
