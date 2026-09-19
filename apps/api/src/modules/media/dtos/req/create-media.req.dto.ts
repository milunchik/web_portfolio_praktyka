import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMediaReqDto {
  @ApiProperty({ example: 'https://supabase.local/storage/v1/object/public/media/1/photo.jpg' })
  @IsNotEmpty()
  @IsString()
  url!: string;

  @ApiProperty({ example: 'photo.jpg' })
  @IsNotEmpty()
  @IsString()
  fileName!: string;

  @ApiProperty({ example: 'image/jpeg' })
  @IsNotEmpty()
  @IsString()
  mimeType!: string;

  @ApiPropertyOptional({ example: 1024 })
  @IsOptional()
  @IsNumber()
  size?: number;
}
