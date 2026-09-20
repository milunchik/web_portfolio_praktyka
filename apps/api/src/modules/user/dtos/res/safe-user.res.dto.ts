import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { CvDisplayOptions } from '@repo/contracts';

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

  @ApiPropertyOptional({ type: String, example: '1/172678000-photo.jpg', nullable: true })
  fileName?: string | null;

  @ApiPropertyOptional({ type: String, example: 'https://supabase.local/storage/v1/object/public/media/1/172678000-photo.jpg', nullable: true })
  avatarUrl?: string | null;

  @ApiPropertyOptional({ type: String, example: 'https://supabase.local/storage/v1/object/public/media/1/172678000-photo.jpg', nullable: true })
  fileUrl?: string | null;

  @ApiPropertyOptional({
    example: {
      showPhoto: true,
      showContact: true,
      showAbout: true,
      showExperience: true,
      showEducation: true,
      showSkills: true,
      showLanguages: true,
      showProjects: true,
    },
    nullable: true,
  })
  cvOptions?: CvDisplayOptions | null;

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
