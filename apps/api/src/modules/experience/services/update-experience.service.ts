import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ExperienceRepository, ExperienceEntity } from '../repositories/experience.repository';
import { UpdateExperienceReqDto } from '../dtos/req/update-experience.req.dto';

@Injectable()
export class UpdateExperienceService {
  constructor(private readonly experienceRepository: ExperienceRepository) {}

  async execute(
    userId: number,
    id: number,
    dto: UpdateExperienceReqDto,
  ): Promise<ExperienceEntity> {
    const experience = await this.experienceRepository.findById(id);
    if (!experience) {
      throw new NotFoundException(`Experience with ID ${id} not found`);
    }

    if (experience.userId !== userId) {
      throw new ForbiddenException('You do not have permission to update this experience');
    }

    return this.experienceRepository.update(id, dto);
  }
}
