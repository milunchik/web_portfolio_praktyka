import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { EducationRepository } from '../repositories/education.repository';

@Injectable()
export class DeleteEducationService {
  constructor(private readonly educationRepository: EducationRepository) {}

  async execute(userId: number, id: number): Promise<void> {
    const education = await this.educationRepository.findById(id);
    if (!education) {
      throw new NotFoundException(`Education with ID ${id} not found`);
    }

    if (education.userId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this education record');
    }

    await this.educationRepository.delete(id);
  }
}
