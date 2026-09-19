import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EducationDegree } from '@prisma/client';

export class EducationResDto {
  @ApiProperty({ type: Number, example: 1 })
  id!: number;

  @ApiProperty({ type: Number, example: 1 })
  userId!: number;

  @ApiProperty({ type: String, example: 'Computer Science' })
  title!: string;

  @ApiProperty({ enum: EducationDegree, example: EducationDegree.bachelor })
  degree!: EducationDegree;

  @ApiProperty({ type: Date, example: '2020-09-01T00:00:00.000Z' })
  startDate!: Date;

  @ApiPropertyOptional({ type: Date, nullable: true, example: '2024-06-30T00:00:00.000Z' })
  endDate!: Date | null;

  @ApiProperty({ type: Date })
  createdAt!: Date;

  @ApiProperty({ type: Date })
  updatedAt!: Date;
}
