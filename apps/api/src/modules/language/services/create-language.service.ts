import { Injectable } from '@nestjs/common';
import { LanguageRepository, LanguageEntity } from '../repositories/language.repository';
import { CreateLanguageReqDto } from '../dtos/req/create-language.req.dto';

@Injectable()
export class CreateLanguageService {
  constructor(private readonly languageRepository: LanguageRepository) {}

  async execute(userId: number, dto: CreateLanguageReqDto): Promise<LanguageEntity> {
    return this.languageRepository.create(userId, dto);
  }
}
