import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateExperienceReqDto {
  @ApiPropertyOptional({ example: 'Google', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  company?: string;

  @ApiPropertyOptional({ example: 'Staff Software Engineer', maxLength: 30 })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  position?: string;

  @ApiPropertyOptional({ example: 'Leading architecture and system design.', maxLength: 300 })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  description?: string;

  @ApiPropertyOptional({ example: '2022-01-01T00:00:00.000Z', type: String })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2024-01-01T00:00:00.000Z', type: String, nullable: true })
  @IsOptional()
  @IsDateString()
  endDate?: string | null;

  @ApiPropertyOptional({ example: ['TypeScript', 'NestJS', 'PostgreSQL', 'Kubernetes'], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];
}
