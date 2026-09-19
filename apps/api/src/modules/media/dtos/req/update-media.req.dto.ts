import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateMediaReqDto {
  @ApiPropertyOptional({ example: 'https://example.com/new-photo.jpg' })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiPropertyOptional({ example: 'new-photo.jpg' })
  @IsOptional()
  @IsString()
  fileName?: string;

  @ApiPropertyOptional({ example: 'image/jpeg' })
  @IsOptional()
  @IsString()
  mimeType?: string;

  @ApiPropertyOptional({ example: 2048 })
  @IsOptional()
  @IsNumber()
  size?: number;
}
