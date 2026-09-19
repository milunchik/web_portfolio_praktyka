import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { LanguageRepository, LanguageEntity } from '../repositories/language.repository';
import { UpdateLanguageReqDto } from '../dtos/req/update-language.req.dto';

@Injectable()
export class UpdateLanguageService {
  constructor(private readonly languageRepository: LanguageRepository) {}

  async execute(
    userId: number,
    id: number,
    dto: UpdateLanguageReqDto,
  ): Promise<LanguageEntity> {
    const language = await this.languageRepository.findById(id);
    if (!language) {
      throw new NotFoundException(`Language with ID ${id} not found`);
    }

    const isUserLang = await this.languageRepository.isUserLanguage(userId, id);
    if (!isUserLang) {
      throw new ForbiddenException('You do not have permission to update this language');
    }

    return this.languageRepository.update(id, dto);
  }
}
