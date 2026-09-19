import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'prod']).default('dev'),
  PORT: z.coerce.number().int().positive().default(5000),

  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  CORS_ORIGIN: z.string().optional(),
  CREDENTIALS: z.string().optional(),
  CORS_ENABLED: z
    .enum(['true', 'false'])
    .default('true')
    .transform((value) => value === 'true'),

  CACHE: z
    .enum(['true', 'false'])
    .default('true')
    .transform((value) => value === 'true'),

  MAIL_PROVIDER: z.enum(['smtp', 'noop']).default('smtp'),
  MAIL_HOST: z.string().optional(),
  MAIL_PORT: z.coerce.number().optional(),
  MAIL_USER: z.string().optional(),
  MAIL_PASS: z.string().optional(),
  MAIL_FROM: z.string().optional(),
  MAIL_WORKER_ENABLED: z
    .enum(['true', 'false'])
    .default('true')
    .transform((value) => value === 'true'),
  MAIL_WORKER_INTERVAL_MS: z.coerce.number().int().positive().default(1000),
  MAIL_WORKER_BATCH_SIZE: z.coerce.number().int().positive().default(10),

  REDIS_HOST: z.string().optional(),
  REDIS_PORT: z.coerce.number().optional(),
  REDIS_TTL: z.coerce.number().optional(),
  REDIS_USERNAME: z.string().optional(),
  REDIS_PASSWORD: z.string().optional(),

  POSTGRES_USER: z.string().optional(),
  POSTGRES_PASSWORD: z.string().optional(),
  POSTGRES_DB: z.string().optional(),
  POSTGRES_PORT: z.coerce.number().optional(),
  POSTGRES_HOST: z.string().optional(),

  JWT_SECRET: z.string().optional(),
  JWT_REFRESH_SECRET: z.string().optional(),
  JWT_SECRET_LIFE_TIME: z.string().optional(),
  JWT_REFRESH_LIFE_TIME: z.string().optional(),
  MAX_COUNT_SESSIONS: z.coerce.number().optional(),
});

export type EnvVars = z.infer<typeof envSchema>;
