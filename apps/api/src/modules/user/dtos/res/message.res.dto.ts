import { ApiProperty } from '@nestjs/swagger';

export class MessageResDto {
  @ApiProperty({ example: 'Operation completed successfully' })
  message!: string;
}
