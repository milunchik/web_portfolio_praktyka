import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { LanguageRepository } from '../repositories/language.repository';

@Injectable()
export class DeleteLanguageService {
  constructor(private readonly languageRepository: LanguageRepository) {}

  async execute(userId: number, id: number): Promise<void> {
    const language = await this.languageRepository.findById(id);
    if (!language) {
      throw new NotFoundException(`Language with ID ${id} not found`);
    }

    const isUserLang = await this.languageRepository.isUserLanguage(userId, id);
    if (!isUserLang) {
      throw new ForbiddenException('You do not have permission to delete this language');
    }

    await this.languageRepository.delete(userId, id);
  }
}
