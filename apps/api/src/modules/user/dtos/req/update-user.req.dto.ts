import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { REGEX } from '../../../../shared/constants';
import type { UserRole } from '../../repositories/user.repository';

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

  @ApiPropertyOptional({ example: 'john-doe' })
  @IsOptional()
  @IsString()
  publicUrl?: string;

  @ApiPropertyOptional({ example: 'user', enum: ['admin', 'user'] })
  @IsOptional()
  @IsEnum(['admin', 'user'] as const)
  role?: UserRole;
}
