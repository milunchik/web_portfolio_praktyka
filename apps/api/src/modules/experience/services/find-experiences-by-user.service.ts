import { Injectable } from '@nestjs/common';
import { ExperienceRepository, ExperienceEntity } from '../repositories/experience.repository';

@Injectable()
export class FindExperiencesByUserService {
  constructor(private readonly experienceRepository: ExperienceRepository) {}

  async execute(userId: number): Promise<ExperienceEntity[]> {
    return this.experienceRepository.findByUserId(userId);
  }
}
