import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectRepository, ProjectEntity } from '../repositories/project.repository';

@Injectable()
export class FindProjectByIdService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(id: number): Promise<ProjectEntity> {
    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }
}
