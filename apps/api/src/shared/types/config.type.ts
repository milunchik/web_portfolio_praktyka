export type MailConfig = {
  provider: 'smtp' | 'noop';
  host?: string;
  port?: number;
  user?: string;
  pass?: string;
  from?: string;
  workerEnabled: boolean;
  workerIntervalMs: number;
  workerBatchSize: number;
};

export type RedisConfig = {
  enabled: boolean;
  host?: string;
  port?: number;
  ttl?: number;
  user?: string;
  pass?: string;
};

export type AuthConfig = {
  secret: string;
  refreshSecret: string;
  secretLife: string;
  refreshSecretLife: string;
  sessionCount: number;
};

export type StorageConfig = {
  supabaseUrl?: string;
  supabaseKey?: string;
  supabaseBucket: string;
};

export type CorsConfig = {
  credentials: boolean;
  enabled: boolean;
  cors: string;
};

export type CorsOrigin = string | undefined;
export type CorsCallback = (
  err: Error | null,
  allow?: boolean | string,
) => void;
