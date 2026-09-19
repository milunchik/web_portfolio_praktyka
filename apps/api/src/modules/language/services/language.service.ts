import { Injectable } from '@nestjs/common';
import { CreateLanguageService } from './create-language.service';
import { FindLanguageByIdService } from './find-language-by-id.service';
import { FindLanguagesByUserService } from './find-languages-by-user.service';
import { UpdateLanguageService } from './update-language.service';
import { DeleteLanguageService } from './delete-language.service';
import { CreateLanguageReqDto, UpdateLanguageReqDto } from '../dtos/req';
import { LanguageEntity } from '../repositories/language.repository';

@Injectable()
export class LanguageService {
  constructor(
    private readonly createLanguageService: CreateLanguageService,
    private readonly findLanguageByIdService: FindLanguageByIdService,
    private readonly findLanguagesByUserService: FindLanguagesByUserService,
    private readonly updateLanguageService: UpdateLanguageService,
    private readonly deleteLanguageService: DeleteLanguageService,
  ) {}

  async create(userId: number, dto: CreateLanguageReqDto): Promise<LanguageEntity> {
    return this.createLanguageService.execute(userId, dto);
  }

  async findById(id: number): Promise<LanguageEntity> {
    return this.findLanguageByIdService.execute(id);
  }

  async findByUserId(userId: number): Promise<LanguageEntity[]> {
    return this.findLanguagesByUserService.execute(userId);
  }

  async update(userId: number, id: number, dto: UpdateLanguageReqDto): Promise<LanguageEntity> {
    return this.updateLanguageService.execute(userId, id, dto);
  }

  async delete(userId: number, id: number): Promise<void> {
    return this.deleteLanguageService.execute(userId, id);
  }
}
