import { Injectable, NotFoundException } from '@nestjs/common';
import { LanguageRepository, LanguageEntity } from '../repositories/language.repository';

@Injectable()
export class FindLanguageByIdService {
  constructor(private readonly languageRepository: LanguageRepository) {}

  async execute(id: number): Promise<LanguageEntity> {
    const language = await this.languageRepository.findById(id);
    if (!language) {
      throw new NotFoundException(`Language with ID ${id} not found`);
    }
    return language;
  }
}
