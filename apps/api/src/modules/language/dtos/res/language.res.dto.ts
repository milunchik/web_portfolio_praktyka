import { ApiProperty } from '@nestjs/swagger';
import { LanguageLevel } from '@prisma/client';

export class LanguageResDto {
  @ApiProperty({ type: Number, example: 1 })
  id!: number;

  @ApiProperty({ type: String, example: 'English' })
  name!: string;

  @ApiProperty({ enum: LanguageLevel, example: LanguageLevel.advanced })
  level!: LanguageLevel;

  @ApiProperty({ type: Date })
  createdAt!: Date;

  @ApiProperty({ type: Date })
  updatedAt!: Date;
}
