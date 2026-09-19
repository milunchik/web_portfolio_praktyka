import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SigninReqDto {
  @ApiProperty({ type: String, example: 'example@gmail.com' })
  @IsString()
  @IsEmail()
  email!: string;

  @ApiProperty({ type: String, example: 'ExamplePassword123!' })
  @IsString()
  password!: string;
}
