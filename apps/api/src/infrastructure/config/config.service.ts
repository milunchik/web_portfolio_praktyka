import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { EnvVars } from './env.validation';
import {
  RedisConfig,
  MailConfig,
  AuthConfig,
  CorsConfig,
  StorageConfig,
} from '../../shared/types';

@Injectable()
export class AppConfigService {
  constructor(private readonly config: ConfigService<EnvVars, true>) {}

  get nodeEnv(): EnvVars['NODE_ENV'] {
    return this.config.get('NODE_ENV');
  }

  get cors(): CorsConfig {
    return {
      cors: this.config.get('CORS_ORIGIN'),
      credentials: this.config.get('CREDENTIALS'),
      enabled: this.config.get('CORS_ENABLED'),
    };
  }

  get isProd(): boolean {
    return this.nodeEnv === 'prod' || this.nodeEnv === 'production';
  }

  get port(): number {
    return this.config.get('PORT');
  }

  get databaseUrl(): string {
    return this.config.get('DATABASE_URL');
  }

  get corsOrigin(): string | undefined {
    return this.config.get('CORS_ORIGIN');
  }

  get mail(): MailConfig {
    return {
      provider: this.config.get('MAIL_PROVIDER'),
      host: this.config.get('MAIL_HOST'),
      port: this.config.get('MAIL_PORT'),
      user: this.config.get('MAIL_USER'),
      pass: this.config.get('MAIL_PASS'),
      from: this.config.get('MAIL_FROM'),
      workerEnabled: this.config.get('MAIL_WORKER_ENABLED'),
      workerIntervalMs: this.config.get('MAIL_WORKER_INTERVAL_MS'),
      workerBatchSize: this.config.get('MAIL_WORKER_BATCH_SIZE'),
    };
  }

  get redis(): RedisConfig {
    return {
      enabled: this.config.get('CACHE'),
      host: this.config.get('REDIS_HOST'),
      port: this.config.get('REDIS_PORT'),
      ttl: this.config.get('REDIS_TTL'),
      user: this.config.get('REDIS_USERNAME'),
      pass: this.config.get('REDIS_PASSWORD'),
    };
  }

  get auth(): AuthConfig {
    return {
      secret: this.config.get('JWT_SECRET'),
      refreshSecret: this.config.get('JWT_REFRESH_SECRET'),
      secretLife: this.config.get('JWT_SECRET_LIFE_TIME'),
      refreshSecretLife: this.config.get('JWT_REFRESH_LIFE_TIME'),
      sessionCount: this.config.get('MAX_COUNT_SESSIONS'),
    };
  }

  get storage(): StorageConfig {
    return {
      supabaseUrl: this.config.get('SUPABASE_URL'),
      supabaseKey: this.config.get('SUPABASE_KEY'),
      supabaseBucket: this.config.get('SUPABASE_BUCKET') ?? 'media',
    };
  }
}
