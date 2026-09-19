import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshReqDto {
  @ApiProperty({ type: String, description: 'JWT refresh token' })
  @IsString()
  refreshToken!: string;
}
