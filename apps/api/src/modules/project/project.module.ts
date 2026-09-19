import { Module } from '@nestjs/common';
import { ProjectController } from './controllers/project.controller';
import { ProjectRepository } from './repositories/project.repository';
import { PrismaProjectRepository } from './repositories/prisma-project.repository';
import {
  CreateProjectService,
  FindProjectByIdService,
  FindProjectsByUserService,
  UpdateProjectService,
  DeleteProjectService,
  ProjectService,
} from './services';

@Module({
  controllers: [ProjectController],
  providers: [
    { provide: ProjectRepository, useClass: PrismaProjectRepository },
    CreateProjectService,
    FindProjectByIdService,
    FindProjectsByUserService,
    UpdateProjectService,
    DeleteProjectService,
    ProjectService,
  ],
  exports: [
    ProjectRepository,
    CreateProjectService,
    FindProjectByIdService,
    FindProjectsByUserService,
    UpdateProjectService,
    DeleteProjectService,
    ProjectService,
  ],
})
export class ProjectModule {}
