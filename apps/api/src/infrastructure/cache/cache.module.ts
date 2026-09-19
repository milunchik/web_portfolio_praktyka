import { Global, Module } from '@nestjs/common';
import { CachePort } from '../../shared/domain/ports';
import { AppConfigModule } from '../config';
import { CacheService } from './cache.service.js';

@Global()
@Module({
  imports: [AppConfigModule],
  providers: [CacheService, { provide: CachePort, useExisting: CacheService }],
  exports: [CacheService, CachePort],
})
export class CacheModule {}
