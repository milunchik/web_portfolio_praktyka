import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { LanguageLevel } from '@prisma/client';

export class UpdateLanguageReqDto {
  @ApiPropertyOptional({ example: 'English', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;

  @ApiPropertyOptional({ enum: LanguageLevel, example: LanguageLevel.upper_intermediate })
  @IsOptional()
  @IsEnum(LanguageLevel)
  level?: LanguageLevel;
}
