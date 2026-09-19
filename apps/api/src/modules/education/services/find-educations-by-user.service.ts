import { Injectable } from '@nestjs/common';
import { EducationRepository, EducationEntity } from '../repositories/education.repository';

@Injectable()
export class FindEducationsByUserService {
  constructor(private readonly educationRepository: EducationRepository) {}

  async execute(userId: number): Promise<EducationEntity[]> {
    return this.educationRepository.findByUserId(userId);
  }
}
