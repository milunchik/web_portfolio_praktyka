import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ExperienceRepository } from '../repositories/experience.repository';

@Injectable()
export class DeleteExperienceService {
  constructor(private readonly experienceRepository: ExperienceRepository) {}

  async execute(userId: number, id: number): Promise<void> {
    const experience = await this.experienceRepository.findById(id);
    if (!experience) {
      throw new NotFoundException(`Experience with ID ${id} not found`);
    }

    if (experience.userId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this experience');
    }

    await this.experienceRepository.delete(id);
  }
}
