import { ApiProperty } from '@nestjs/swagger';

export class ProjectResDto {
  @ApiProperty({ type: Number, example: 1 })
  id!: number;

  @ApiProperty({ type: Number, example: 1 })
  userId!: number;

  @ApiProperty({ type: String, example: 'Portfolio Website' })
  title!: string;

  @ApiProperty({ type: String, example: 'A modern portfolio web application built with NestJS and Angular.' })
  description!: string;

  @ApiProperty({ type: Date })
  createdAt!: Date;

  @ApiProperty({ type: Date })
  updatedAt!: Date;
}
