import { Injectable } from '@nestjs/common';
import { CreateEducationService } from './create-education.service';
import { FindEducationByIdService } from './find-education-by-id.service';
import { FindEducationsByUserService } from './find-educations-by-user.service';
import { UpdateEducationService } from './update-education.service';
import { DeleteEducationService } from './delete-education.service';
import { CreateEducationReqDto, UpdateEducationReqDto } from '../dtos/req';
import { EducationEntity } from '../repositories/education.repository';

@Injectable()
export class EducationService {
  constructor(
    private readonly createEducationService: CreateEducationService,
    private readonly findEducationByIdService: FindEducationByIdService,
    private readonly findEducationsByUserService: FindEducationsByUserService,
    private readonly updateEducationService: UpdateEducationService,
    private readonly deleteEducationService: DeleteEducationService,
  ) {}

  async create(userId: number, dto: CreateEducationReqDto): Promise<EducationEntity> {
    return this.createEducationService.execute(userId, dto);
  }

  async findById(id: number): Promise<EducationEntity> {
    return this.findEducationByIdService.execute(id);
  }

  async findByUserId(userId: number): Promise<EducationEntity[]> {
    return this.findEducationsByUserService.execute(userId);
  }

  async update(userId: number, id: number, dto: UpdateEducationReqDto): Promise<EducationEntity> {
    return this.updateEducationService.execute(userId, id, dto);
  }

  async delete(userId: number, id: number): Promise<void> {
    return this.deleteEducationService.execute(userId, id);
  }
}
