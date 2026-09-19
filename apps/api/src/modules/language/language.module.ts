import { Module } from '@nestjs/common';
import { LanguageController } from './controllers/language.controller';
import { LanguageRepository } from './repositories/language.repository';
import { PrismaLanguageRepository } from './repositories/prisma-language.repository';
import {
  CreateLanguageService,
  FindLanguageByIdService,
  FindLanguagesByUserService,
  UpdateLanguageService,
  DeleteLanguageService,
  LanguageService,
} from './services';

@Module({
  controllers: [LanguageController],
  providers: [
    { provide: LanguageRepository, useClass: PrismaLanguageRepository },
    CreateLanguageService,
    FindLanguageByIdService,
    FindLanguagesByUserService,
    UpdateLanguageService,
    DeleteLanguageService,
    LanguageService,
  ],
  exports: [
    LanguageRepository,
    CreateLanguageService,
    FindLanguageByIdService,
    FindLanguagesByUserService,
    UpdateLanguageService,
    DeleteLanguageService,
    LanguageService,
  ],
})
export class LanguageModule {}
