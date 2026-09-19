import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { LanguageLevel } from '@prisma/client';

export class CreateLanguageReqDto {
  @ApiProperty({ example: 'English', maxLength: 50 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name!: string;

  @ApiProperty({ enum: LanguageLevel, example: LanguageLevel.advanced })
  @IsNotEmpty()
  @IsEnum(LanguageLevel)
  level!: LanguageLevel;
}
