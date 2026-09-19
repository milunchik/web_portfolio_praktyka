import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env.validation';
import { AppConfigService } from './config.service';

function pickEnvFile(): string {
  const explicit = process.env.ENV_FILE;
  if (explicit && explicit.trim().length > 0) return explicit;

  const inDocker = process.env.IN_DOCKER === 'true';
  if (inDocker) return '.env.production.local';

  return '.env';
}

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: pickEnvFile(),
      cache: true,
      validate: (cfg) => envSchema.parse(cfg),
    }),
  ],
  providers: [AppConfigService],
  exports: [ConfigModule, AppConfigService],
})
export class AppConfigModule {}
