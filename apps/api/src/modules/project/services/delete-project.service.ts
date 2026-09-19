import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ProjectRepository } from '../repositories/project.repository';

@Injectable()
export class DeleteProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(userId: number, id: number): Promise<void> {
    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    if (project.userId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this project');
    }

    await this.projectRepository.delete(id);
  }
}
