import { MediaResDto } from '../dtos/res/media.res.dto';

export class MediaEntity {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly url: string,
    public readonly fileName: string,
    public readonly mimeType: string,
    public readonly size: number = 0,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  toResponseDto(): MediaResDto {
    return {
      id: this.id,
      userId: this.userId,
      url: this.url,
      fileName: this.fileName,
      mimeType: this.mimeType,
      size: this.size,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export interface CreateMediaData {
  url: string;
  fileName: string;
  mimeType: string;
  size?: number;
}

export interface UpdateMediaData {
  url?: string;
  fileName?: string;
  mimeType?: string;
  size?: number;
}

export abstract class MediaRepository {
  abstract findById(id: number): Promise<MediaEntity | null>;
  abstract findByUserId(userId: number): Promise<MediaEntity[]>;
  abstract findAll(conditions?: Record<string, unknown>): Promise<MediaEntity[]>;
  abstract count(conditions?: Record<string, unknown>): Promise<number>;
  abstract create(userId: number, data: CreateMediaData): Promise<MediaEntity>;
  abstract update(id: number, data: UpdateMediaData): Promise<MediaEntity>;
  abstract delete(id: number): Promise<void>;
}
