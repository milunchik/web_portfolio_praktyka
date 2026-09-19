import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { EducationDegree } from '@prisma/client';

export class CreateEducationReqDto {
  @ApiProperty({ example: 'Computer Science', maxLength: 50 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  title!: string;

  @ApiPropertyOptional({
    enum: EducationDegree,
    default: EducationDegree.bachelor,
    example: EducationDegree.bachelor,
  })
  @IsOptional()
  @IsEnum(EducationDegree)
  degree?: EducationDegree;

  @ApiProperty({ example: '2020-09-01T00:00:00.000Z', type: String })
  @IsNotEmpty()
  @IsDateString()
  startDate!: string;

  @ApiPropertyOptional({ example: '2024-06-30T00:00:00.000Z', type: String, nullable: true })
  @IsOptional()
  @IsDateString()
  endDate?: string | null;
}
