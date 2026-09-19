import { Injectable, NotFoundException } from '@nestjs/common';
import { EducationRepository, EducationEntity } from '../repositories/education.repository';

@Injectable()
export class FindEducationByIdService {
  constructor(private readonly educationRepository: EducationRepository) {}

  async execute(id: number): Promise<EducationEntity> {
    const education = await this.educationRepository.findById(id);
    if (!education) {
      throw new NotFoundException(`Education with ID ${id} not found`);
    }
    return education;
  }
}
