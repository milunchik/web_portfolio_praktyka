import { ApiProperty } from '@nestjs/swagger';

export class TopProjectResDto {
  @ApiProperty({ example: 1 })
  projectId!: number;

  @ApiProperty({ example: 'Task Manager API' })
  projectName!: string;

  @ApiProperty({ example: 48 })
  clicks!: number;
}
