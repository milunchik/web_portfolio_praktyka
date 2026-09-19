import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { EducationDegree } from '@prisma/client';

export class UpdateEducationReqDto {
  @ApiPropertyOptional({ example: 'Software Engineering', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  title?: string;

  @ApiPropertyOptional({
    enum: EducationDegree,
    example: EducationDegree.master,
  })
  @IsOptional()
  @IsEnum(EducationDegree)
  degree?: EducationDegree;

  @ApiPropertyOptional({ example: '2020-09-01T00:00:00.000Z', type: String })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2024-06-30T00:00:00.000Z', type: String, nullable: true })
  @IsOptional()
  @IsDateString()
  endDate?: string | null;
}
