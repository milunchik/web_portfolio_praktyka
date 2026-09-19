import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AppConfigModule, PrismaModule } from './infrastructure';
import { SharedModule, SecurityModule } from './shared';
import { AuthModule, UserModule, ExperienceModule, EducationModule, ProjectModule } from './modules';

@Module({
  imports: [
    AppConfigModule,
    PrismaModule,
    SecurityModule,
    SharedModule,
    AuthModule,
    UserModule,
    ExperienceModule,
    EducationModule,
    ProjectModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
