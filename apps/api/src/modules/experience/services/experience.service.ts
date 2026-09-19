import { Injectable } from '@nestjs/common';
import { CreateExperienceService } from './create-experience.service';
import { FindExperienceByIdService } from './find-experience-by-id.service';
import { FindExperiencesByUserService } from './find-experiences-by-user.service';
import { UpdateExperienceService } from './update-experience.service';
import { DeleteExperienceService } from './delete-experience.service';
import { CreateExperienceReqDto, UpdateExperienceReqDto } from '../dtos/req';
import { ExperienceEntity } from '../repositories/experience.repository';

@Injectable()
export class ExperienceService {
  constructor(
    private readonly createExperienceService: CreateExperienceService,
    private readonly findExperienceByIdService: FindExperienceByIdService,
    private readonly findExperiencesByUserService: FindExperiencesByUserService,
    private readonly updateExperienceService: UpdateExperienceService,
    private readonly deleteExperienceService: DeleteExperienceService,
  ) {}

  async create(userId: number, dto: CreateExperienceReqDto): Promise<ExperienceEntity> {
    return this.createExperienceService.execute(userId, dto);
  }

  async findById(id: number): Promise<ExperienceEntity> {
    return this.findExperienceByIdService.execute(id);
  }

  async findByUserId(userId: number): Promise<ExperienceEntity[]> {
    return this.findExperiencesByUserService.execute(userId);
  }

  async update(userId: number, id: number, dto: UpdateExperienceReqDto): Promise<ExperienceEntity> {
    return this.updateExperienceService.execute(userId, id, dto);
  }

  async delete(userId: number, id: number): Promise<void> {
    return this.deleteExperienceService.execute(userId, id);
  }
}
