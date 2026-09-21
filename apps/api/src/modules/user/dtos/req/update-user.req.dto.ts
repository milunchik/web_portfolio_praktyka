import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { REGEX } from '../../../../shared/constants';
import type { UserRole } from '../../repositories/user.repository';
import type { CvDisplayOptions } from '@repo/contracts';

export class UpdateUserReqDto {
  @ApiPropertyOptional({ example: 'user@example.com' })
  @IsOptional()
  @IsEmail()
  @Matches(REGEX.EMAIL, { message: 'Email must be valid' })
  email?: string;

  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  fullName?: string;

  @ApiPropertyOptional({ example: 'Software Engineer' })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @ApiPropertyOptional({ example: 'Passionate software developer with 5+ years of experience...' })
  @IsOptional()
  @IsString()
  @Length(0, 1500)
  about?: string;

  @ApiPropertyOptional({ example: 'john-doe' })
  @IsOptional()
  @IsString()
  publicUrl?: string;

  @ApiPropertyOptional({ example: '1/172678000-avatar.jpg', nullable: true })
  @IsOptional()
  @IsString()
  fileName?: string | null;

  @ApiPropertyOptional({ example: 'user', enum: ['admin', 'user'] })
  @IsOptional()
  @IsEnum(['admin', 'user'] as const)
  role?: UserRole;

  @ApiPropertyOptional({ example: 'Kyiv, Ukraine', nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  location?: string | null;

  @ApiPropertyOptional({ example: 'https://jane-doe.dev', nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 200)
  website?: string | null;

  @ApiPropertyOptional({ example: 'jane-doe', nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  github?: string | null;

  @ApiPropertyOptional({ example: 'janedoe', nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  linkedin?: string | null;

  @ApiPropertyOptional({ example: 'jane_doe', nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  twitter?: string | null;

  @ApiPropertyOptional({ example: 'jane-doe', nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  dribbble?: string | null;

  @ApiPropertyOptional({
    example: {
      showPhoto: true,
      showContact: true,
      showAbout: true,
      showExperience: true,
      showEducation: true,
      showSkills: true,
      showLanguages: true,
      showProjects: true,
    },
  })
  @IsOptional()
  @IsObject()
  cvOptions?: CvDisplayOptions | null;
}
