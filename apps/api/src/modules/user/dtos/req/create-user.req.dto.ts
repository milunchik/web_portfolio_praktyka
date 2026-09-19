import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';
import { REGEX } from '../../../../shared/constants';
import type { UserRole } from '../../repositories/user.repository';

export class CreateUserReqDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsNotEmpty()
  @IsEmail()
  @Matches(REGEX.EMAIL, { message: 'Email must be valid' })
  email!: string;

  @ApiProperty({ example: 'Password123' })
  @IsNotEmpty()
  @IsString()
  @Matches(REGEX.PASSWORD, {
    message:
      'Password must be at least 8 characters long and contain at least one uppercase letter and one number',
  })
  password!: string;

  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ example: 'user', enum: ['admin', 'user'] })
  @IsNotEmpty()
  @IsEnum(['admin', 'user'] as const)
  role!: UserRole;
}
