import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class SignupReqDto {
  @ApiProperty({ type: String, example: 'example@gmail.com' })
  @IsString()
  @IsEmail()
  email!: string;

  @ApiProperty({ type: String, example: 'John Doe' })
  @IsString()
  name!: string;

  @ApiProperty({ type: String, example: 'ExamplePassword123!' })
  @IsString()
  @MinLength(8, { message: 'The password must be at least 8 characters long' })
  @Matches(/\d/, { message: 'Password must contain at least one number' })
  password!: string;
}
