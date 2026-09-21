import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { REGEX } from '../../../../shared/constants';

export class UpdateEmailReqDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be valid' })
  @Matches(REGEX.EMAIL, { message: 'Email must be valid' })
  email!: string;
}
