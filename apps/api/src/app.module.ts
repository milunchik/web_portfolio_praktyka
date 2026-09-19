import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AppConfigModule, PrismaModule } from './infrastructure';
import { SharedModule, SecurityModule } from './shared';
import { AuthModule, UserModule, ExperienceModule, EducationModule } from './modules';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
