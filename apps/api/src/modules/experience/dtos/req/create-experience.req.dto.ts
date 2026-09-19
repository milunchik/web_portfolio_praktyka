import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateExperienceReqDto {
  @ApiProperty({ example: 'Google', maxLength: 100 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  company!: string;

  @ApiProperty({ example: 'Senior Software Engineer', maxLength: 30 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  position!: string;

  @ApiProperty({ example: 'Building high-throughput backend services and cloud infrastructure.', maxLength: 300 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(300)
  description!: string;

  @ApiProperty({ example: '2022-01-01T00:00:00.000Z', type: String })
  @IsNotEmpty()
  @IsDateString()
  startDate!: string;

  @ApiPropertyOptional({ example: '2024-01-01T00:00:00.000Z', type: String, nullable: true })
  @IsOptional()
  @IsDateString()
  endDate?: string | null;

  @ApiPropertyOptional({ example: ['TypeScript', 'NestJS', 'PostgreSQL'], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];
}
