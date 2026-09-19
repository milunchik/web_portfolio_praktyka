import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { config } from 'dotenv';
import { resolve } from 'node:path';

config({ path: [resolve(__dirname, '../.env'), resolve(__dirname, '../../../.env')] });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
    origin: process.env.WEB_URL ?? 'http://localhost:3000',
  });
  await app.listen(process.env.PORT ?? 3001);
}

void bootstrap();
