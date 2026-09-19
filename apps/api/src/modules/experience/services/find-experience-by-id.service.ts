import { Injectable, NotFoundException } from '@nestjs/common';
import { ExperienceRepository, ExperienceEntity } from '../repositories/experience.repository';

@Injectable()
export class FindExperienceByIdService {
  constructor(private readonly experienceRepository: ExperienceRepository) {}

  async execute(id: number): Promise<ExperienceEntity> {
    const experience = await this.experienceRepository.findById(id);
    if (!experience) {
      throw new NotFoundException(`Experience with ID ${id} not found`);
    }
    return experience;
  }
}
