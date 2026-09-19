import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ProjectRepository, ProjectEntity } from '../repositories/project.repository';
import { UpdateProjectReqDto } from '../dtos/req/update-project.req.dto';

@Injectable()
export class UpdateProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(
    userId: number,
    id: number,
    dto: UpdateProjectReqDto,
  ): Promise<ProjectEntity> {
    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    if (project.userId !== userId) {
      throw new ForbiddenException('You do not have permission to update this project');
    }

    return this.projectRepository.update(id, dto);
  }
}
