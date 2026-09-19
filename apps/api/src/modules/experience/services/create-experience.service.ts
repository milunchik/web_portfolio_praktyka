import { Injectable } from '@nestjs/common';
import { ExperienceRepository, ExperienceEntity } from '../repositories/experience.repository';
import { CreateExperienceReqDto } from '../dtos/req/create-experience.req.dto';

@Injectable()
export class CreateExperienceService {
  constructor(private readonly experienceRepository: ExperienceRepository) {}

  async execute(userId: number, dto: CreateExperienceReqDto): Promise<ExperienceEntity> {
    return this.experienceRepository.create(userId, dto);
  }
}
