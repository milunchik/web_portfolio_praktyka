import { Injectable } from '@nestjs/common';
import { Prisma, Media } from '@prisma/client';
import { PrismaService } from '../../../infrastructure';
import {
  MediaRepository,
  CreateMediaData,
  UpdateMediaData,
  MediaEntity,
} from './media.repository';

@Injectable()
export class PrismaMediaRepository extends MediaRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  private toEntity(media: Media): MediaEntity {
    return new MediaEntity(
      media.id,
      media.userId,
      media.url,
      media.fileName,
      media.mimeType,
      media.size,
      media.createdAt,
      media.updatedAt,
    );
  }

  async findById(id: number): Promise<MediaEntity | null> {
    const media = await this.prisma.media.findFirst({
      where: { id },
    });
    return media ? this.toEntity(media) : null;
  }

  async findByUserId(userId: number): Promise<MediaEntity[]> {
    const medias = await this.prisma.media.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return medias.map((med) => this.toEntity(med));
  }

  async findAll(conditions?: Prisma.MediaFindManyArgs): Promise<MediaEntity[]> {
    const medias = await this.prisma.media.findMany(conditions);
    return medias.map((med) => this.toEntity(med));
  }

  async count(conditions?: Prisma.MediaCountArgs): Promise<number> {
    return this.prisma.media.count(conditions);
  }

  async create(userId: number, data: CreateMediaData): Promise<MediaEntity> {
    const media = await this.prisma.media.create({
      data: {
        userId,
        url: data.url,
        fileName: data.fileName,
        mimeType: data.mimeType,
        size: data.size ?? 0,
      },
    });
    return this.toEntity(media);
  }

  async update(id: number, data: UpdateMediaData): Promise<MediaEntity> {
    const media = await this.prisma.media.update({
      where: { id },
      data: {
        ...(data.url !== undefined && { url: data.url }),
        ...(data.fileName !== undefined && { fileName: data.fileName }),
        ...(data.mimeType !== undefined && { mimeType: data.mimeType }),
        ...(data.size !== undefined && { size: data.size }),
      },
    });
    return this.toEntity(media);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.media.delete({
      where: { id },
    });
  }
}
