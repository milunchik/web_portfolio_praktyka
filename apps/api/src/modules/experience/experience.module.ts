import { Module } from '@nestjs/common';
import { ExperienceController } from './controllers/experience.controller';
import { ExperienceRepository, PrismaExperienceRepository } from './repositories';
import {
  CreateExperienceService,
  FindExperienceByIdService,
  FindExperiencesByUserService,
  UpdateExperienceService,
  DeleteExperienceService,
  ExperienceService,
} from './services';

@Module({
  controllers: [ExperienceController],
  providers: [
    { provide: ExperienceRepository, useClass: PrismaExperienceRepository },
    CreateExperienceService,
    FindExperienceByIdService,
    FindExperiencesByUserService,
    UpdateExperienceService,
    DeleteExperienceService,
    ExperienceService,
  ],
  exports: [
    ExperienceRepository,
    CreateExperienceService,
    FindExperienceByIdService,
    FindExperiencesByUserService,
    UpdateExperienceService,
    DeleteExperienceService,
    ExperienceService,
  ],
})
export class ExperienceModule {}
