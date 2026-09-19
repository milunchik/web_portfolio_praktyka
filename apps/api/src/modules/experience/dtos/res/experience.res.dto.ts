import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ExperienceResDto {
  @ApiProperty({ type: Number, example: 1 })
  id!: number;

  @ApiProperty({ type: Number, example: 1 })
  userId!: number;

  @ApiProperty({ type: String, example: 'Google' })
  company!: string;

  @ApiProperty({ type: String, example: 'Senior Software Engineer' })
  position!: string;

  @ApiProperty({ type: String, example: 'Building high-throughput backend services and cloud infrastructure.' })
  description!: string;

  @ApiProperty({ type: Date, example: '2022-01-01T00:00:00.000Z' })
  startDate!: Date;

  @ApiPropertyOptional({ type: Date, nullable: true, example: '2024-01-01T00:00:00.000Z' })
  endDate!: Date | null;

  @ApiProperty({ type: [String], example: ['TypeScript', 'NestJS', 'PostgreSQL'] })
  skills!: string[];

  @ApiProperty({ type: Date })
  createdAt!: Date;

  @ApiProperty({ type: Date })
  updatedAt!: Date;
}
