import { Injectable } from '@nestjs/common';
import { ProjectRepository, ProjectEntity } from '../repositories/project.repository';

@Injectable()
export class FindProjectsByUserService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(userId: number): Promise<ProjectEntity[]> {
    return this.projectRepository.findByUserId(userId);
  }
}
