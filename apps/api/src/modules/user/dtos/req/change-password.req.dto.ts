import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordReqDto {
  @ApiProperty({ example: 'CurrentPassword123!' })
  @IsNotEmpty({ message: 'Current password is required' })
  @IsString()
  currentPassword!: string;

  @ApiProperty({ example: 'NewPassword123!' })
  @IsNotEmpty({ message: 'New password is required' })
  @IsString()
  @MinLength(8, { message: 'Password must contain at least 8 characters' })
  newPassword!: string;
}
