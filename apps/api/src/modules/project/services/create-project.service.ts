import { Injectable } from '@nestjs/common';
import { ProjectRepository, ProjectEntity } from '../repositories/project.repository';
import { CreateProjectReqDto } from '../dtos/req/create-project.req.dto';

@Injectable()
export class CreateProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(userId: number, dto: CreateProjectReqDto): Promise<ProjectEntity> {
    return this.projectRepository.create(userId, dto);
  }
}
