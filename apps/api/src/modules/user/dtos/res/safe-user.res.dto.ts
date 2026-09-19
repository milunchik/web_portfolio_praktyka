import { ApiProperty } from '@nestjs/swagger';

export class SafeUserResDto {
  @ApiProperty({ type: Number, example: 1 })
  id!: number;

  @ApiProperty({ type: String, example: 'user@example.com' })
  email!: string;

  @ApiProperty({ type: String, example: 'John Doe' })
  name!: string;

  @ApiProperty({ type: String, example: 'user' })
  role!: string;
}
