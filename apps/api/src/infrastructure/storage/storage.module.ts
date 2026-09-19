import { Global, Module } from '@nestjs/common';
import { StoragePort } from '../../shared/domain/ports/storage.port';
import { SupabaseStorageService } from './supabase-storage.service';

@Global()
@Module({
  providers: [
    {
      provide: StoragePort,
      useClass: SupabaseStorageService,
    },
  ],
  exports: [StoragePort],
})
export class StorageModule {}
