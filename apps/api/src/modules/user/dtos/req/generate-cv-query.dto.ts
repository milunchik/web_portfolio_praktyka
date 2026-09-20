import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

const toBoolean = ({ value }: { value: any }) => {
  if (value === undefined || value === null) return true;
  if (typeof value === 'boolean') return value;
  if (value === 'false' || value === '0') return false;
  if (value === 'true' || value === '1') return true;
  return Boolean(value);
};

export class GenerateCvQueryDto {
  @ApiPropertyOptional({ example: true, default: true, description: 'Include profile photo in CV' })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  showPhoto?: boolean = true;

  @ApiPropertyOptional({ example: true, default: true, description: 'Include contact information in CV' })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  showContact?: boolean = true;

  @ApiPropertyOptional({ example: true, default: true, description: 'Include summary/about in CV' })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  showAbout?: boolean = true;

  @ApiPropertyOptional({ example: true, default: true, description: 'Include work experience in CV' })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  showExperience?: boolean = true;

  @ApiPropertyOptional({ example: true, default: true, description: 'Include education in CV' })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  showEducation?: boolean = true;

  @ApiPropertyOptional({ example: true, default: true, description: 'Include technical skills in CV' })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  showSkills?: boolean = true;

  @ApiPropertyOptional({ example: true, default: true, description: 'Include languages in CV' })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  showLanguages?: boolean = true;

  @ApiPropertyOptional({ example: true, default: true, description: 'Include projects in CV' })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  showProjects?: boolean = true;
}
