import { ApiProperty } from '@nestjs/swagger';

export class MediaResDto {
  @ApiProperty({ type: Number, example: 1 })
  id!: number;

  @ApiProperty({ type: Number, example: 1 })
  userId!: number;

  @ApiProperty({ type: String, example: 'https://supabase.local/storage/v1/object/public/media/1/photo.jpg' })
  url!: string;

  @ApiProperty({ type: String, example: 'photo.jpg' })
  fileName!: string;

  @ApiProperty({ type: String, example: 'image/jpeg' })
  mimeType!: string;

  @ApiProperty({ type: Number, example: 1024 })
  size!: number;

  @ApiProperty({ type: Date })
  createdAt!: Date;

  @ApiProperty({ type: Date })
  updatedAt!: Date;
}
