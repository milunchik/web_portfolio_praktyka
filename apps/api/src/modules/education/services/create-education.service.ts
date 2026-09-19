import { Injectable } from '@nestjs/common';
import { EducationRepository, EducationEntity } from '../repositories/education.repository';
import { CreateEducationReqDto } from '../dtos/req/create-education.req.dto';

@Injectable()
export class CreateEducationService {
  constructor(private readonly educationRepository: EducationRepository) {}

  async execute(userId: number, dto: CreateEducationReqDto): Promise<EducationEntity> {
    return this.educationRepository.create(userId, dto);
  }
}
