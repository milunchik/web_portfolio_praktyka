import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateProjectReqDto {
  @ApiProperty({ example: 'Portfolio Website', maxLength: 50 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  title!: string;

  @ApiProperty({ example: 'A modern portfolio web application built with NestJS and Angular.', maxLength: 500 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  description!: string;
}
