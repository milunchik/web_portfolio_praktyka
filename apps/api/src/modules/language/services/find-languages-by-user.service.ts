import { Injectable } from '@nestjs/common';
import { LanguageRepository, LanguageEntity } from '../repositories/language.repository';

@Injectable()
export class FindLanguagesByUserService {
  constructor(private readonly languageRepository: LanguageRepository) {}

  async execute(userId: number): Promise<LanguageEntity[]> {
    return this.languageRepository.findByUserId(userId);
  }
}
