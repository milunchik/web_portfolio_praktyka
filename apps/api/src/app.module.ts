import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AppConfigModule, PrismaModule, StorageModule } from './infrastructure';
import { SharedModule, SecurityModule } from './shared';
import {
  AuthModule,
  UserModule,
  ExperienceModule,
  EducationModule,
  ProjectModule,
  LanguageModule,
  MediaModule,
} from './modules';

@Module({
  imports: [
    AppConfigModule,
    PrismaModule,
    StorageModule,
    SecurityModule,
    SharedModule,
    AuthModule,
    UserModule,
    ExperienceModule,
    EducationModule,
    ProjectModule,
    LanguageModule,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
