import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { EducationRepository, EducationEntity } from '../repositories/education.repository';
import { UpdateEducationReqDto } from '../dtos/req/update-education.req.dto';

@Injectable()
export class UpdateEducationService {
  constructor(private readonly educationRepository: EducationRepository) {}

  async execute(
    userId: number,
    id: number,
    dto: UpdateEducationReqDto,
  ): Promise<EducationEntity> {
    const education = await this.educationRepository.findById(id);
    if (!education) {
      throw new NotFoundException(`Education with ID ${id} not found`);
    }

    if (education.userId !== userId) {
      throw new ForbiddenException('You do not have permission to update this education record');
    }

    return this.educationRepository.update(id, dto);
  }
}
