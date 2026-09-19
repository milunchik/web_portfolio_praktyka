import { Injectable } from '@nestjs/common';
import { CreateProjectService } from './create-project.service';
import { FindProjectByIdService } from './find-project-by-id.service';
import { FindProjectsByUserService } from './find-projects-by-user.service';
import { UpdateProjectService } from './update-project.service';
import { DeleteProjectService } from './delete-project.service';
import { CreateProjectReqDto, UpdateProjectReqDto } from '../dtos/req';
import { ProjectEntity } from '../repositories/project.repository';

@Injectable()
export class ProjectService {
  constructor(
    private readonly createProjectService: CreateProjectService,
    private readonly findProjectByIdService: FindProjectByIdService,
    private readonly findProjectsByUserService: FindProjectsByUserService,
    private readonly updateProjectService: UpdateProjectService,
    private readonly deleteProjectService: DeleteProjectService,
  ) {}

  async create(userId: number, dto: CreateProjectReqDto): Promise<ProjectEntity> {
    return this.createProjectService.execute(userId, dto);
  }

  async findById(id: number): Promise<ProjectEntity> {
    return this.findProjectByIdService.execute(id);
  }

  async findByUserId(userId: number): Promise<ProjectEntity[]> {
    return this.findProjectsByUserService.execute(userId);
  }

  async update(userId: number, id: number, dto: UpdateProjectReqDto): Promise<ProjectEntity> {
    return this.updateProjectService.execute(userId, id, dto);
  }

  async delete(userId: number, id: number): Promise<void> {
    return this.deleteProjectService.execute(userId, id);
  }
}
