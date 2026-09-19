import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SafeUserResDto {
  @ApiProperty({ type: Number, example: 1 })
  id!: number;

  @ApiProperty({ type: String, example: 'user@example.com' })
  email!: string;

  @ApiProperty({ type: String, example: 'John Doe' })
  fullName!: string;

  @ApiPropertyOptional({ type: String, example: 'Fullstack developer', nullable: true })
  description!: string | null;

  @ApiProperty({ type: String, example: 'john-doe' })
  publicUrl!: string;

  @ApiProperty({ type: String, example: 'user', enum: ['admin', 'user'] })
  role!: string;

  @ApiPropertyOptional({ example: [] })
  education?: any[];

  @ApiPropertyOptional({ example: [] })
  experience?: any[];

  @ApiPropertyOptional({ example: [] })
  medias?: any[];

  @ApiPropertyOptional({ example: [] })
  projects?: any[];

  @ApiPropertyOptional({ example: [] })
  languages?: any[];

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
