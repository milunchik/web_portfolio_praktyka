import { Module } from '@nestjs/common';
import { EducationController } from './controllers/education.controller';
import { EducationRepository } from './repositories/education.repository';
import { PrismaEducationRepository } from './repositories/prisma-education.repository';
import {
  CreateEducationService,
  FindEducationByIdService,
  FindEducationsByUserService,
  UpdateEducationService,
  DeleteEducationService,
  EducationService,
} from './services';

@Module({
  controllers: [EducationController],
  providers: [
    { provide: EducationRepository, useClass: PrismaEducationRepository },
    CreateEducationService,
    FindEducationByIdService,
    FindEducationsByUserService,
    UpdateEducationService,
    DeleteEducationService,
    EducationService,
  ],
  exports: [
    EducationRepository,
    CreateEducationService,
    FindEducationByIdService,
    FindEducationsByUserService,
    UpdateEducationService,
    DeleteEducationService,
    EducationService,
  ],
})
export class EducationModule {}
