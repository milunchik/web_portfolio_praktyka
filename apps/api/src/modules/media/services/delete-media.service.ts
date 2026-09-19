import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { MediaRepository } from '../repositories/media.repository';
import { StoragePort } from '../../../shared/domain/ports/storage.port';

@Injectable()
export class DeleteMediaService {
  constructor(
    private readonly mediaRepository: MediaRepository,
    private readonly storage: StoragePort,
  ) {}

  async execute(userId: number, id: number): Promise<void> {
    const media = await this.mediaRepository.findById(id);
    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }

    if (media.userId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this media record');
    }

    // Try to extract relative file path if it was stored in public storage
    try {
      const publicPrefix = '/object/public/';
      const publicIndex = media.url.indexOf(publicPrefix);
      if (publicIndex !== -1) {
        const fullPath = media.url.substring(publicIndex + publicPrefix.length);
        const parts = fullPath.split('/');
        const bucket = parts[0];
        const filePath = parts.slice(1).join('/');
        if (filePath) {
          await this.storage.delete(filePath, bucket);
        }
      }
    } catch {
      // Best-effort file deletion from storage
    }

    await this.mediaRepository.delete(id);
  }
}
