import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { StoragePort, UploadFileOptions } from '../../shared/domain/ports/storage.port';
import { AppConfigService } from '../config/config.service';

@Injectable()
export class SupabaseStorageService extends StoragePort implements OnModuleInit {
  private readonly logger = new Logger(SupabaseStorageService.name);

  constructor(private readonly config: AppConfigService) {
    super();
  }

  async onModuleInit() {
    await this.ensureBucket();
  }

  private async ensureBucket(): Promise<void> {
    const supabaseUrl = this.config.storage.supabaseUrl;
    const supabaseKey = this.config.storage.supabaseKey;
    const targetBucket = this.config.storage.supabaseBucket || 'media';

    if (!supabaseUrl || !supabaseKey) {
      return;
    }

    const cleanUrl = supabaseUrl.replace(/\/+$/, '');

    try {
      const bucketResponse = await fetch(`${cleanUrl}/storage/v1/bucket/${targetBucket}`, {
        headers: {
          Authorization: `Bearer ${supabaseKey}`,
          apikey: supabaseKey,
        },
      });

      if (bucketResponse.status === 404) {
        const createResponse = await fetch(`${cleanUrl}/storage/v1/bucket`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${supabaseKey}`,
            apikey: supabaseKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: targetBucket,
            name: targetBucket,
            public: true,
          }),
        });

        if (createResponse.ok) {
          this.logger.log(`Created public Supabase storage bucket "${targetBucket}".`);
        } else {
          const err = await createResponse.text();
          this.logger.warn(`Failed to create bucket "${targetBucket}": ${err}`);
        }
      } else if (bucketResponse.ok) {
        const bucketData = (await bucketResponse.json()) as { public?: boolean };
        if (!bucketData.public) {
          const updateResponse = await fetch(`${cleanUrl}/storage/v1/bucket/${targetBucket}`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${supabaseKey}`,
              apikey: supabaseKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              public: true,
            }),
          });

          if (updateResponse.ok) {
            this.logger.log(`Updated Supabase storage bucket "${targetBucket}" to public.`);
          }
        }
      }
    } catch (error: any) {
      this.logger.warn(`Could not verify/initialize Supabase bucket: ${error.message}`);
    }
  }

  getPublicUrl(filePath: string, bucket?: string): string {
    if (!filePath) return '';
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      return filePath;
    }

    const targetBucket = bucket || this.config.storage.supabaseBucket || 'media';
    const supabaseUrl = this.config.storage.supabaseUrl;

    const cleanPath = filePath
      .replace(/^\/+/, '')
      .replace(new RegExp(`^${targetBucket}/`), '');

    if (!supabaseUrl) {
      return `https://supabase.local/storage/v1/object/public/${targetBucket}/${cleanPath}`;
    }

    const cleanUrl = supabaseUrl.replace(/\/+$/, '');
    return `${cleanUrl}/storage/v1/object/public/${targetBucket}/${cleanPath}`;
  }

  async upload(
    filePath: string,
    fileBuffer: Buffer,
    options?: UploadFileOptions,
  ): Promise<string> {
    const targetBucket = options?.bucket || this.config.storage.supabaseBucket || 'media';
    const supabaseUrl = this.config.storage.supabaseUrl;
    const supabaseKey = this.config.storage.supabaseKey;

    if (!supabaseUrl || !supabaseKey) {
      this.logger.warn(
        'Supabase URL or Key not configured. Returning fallback public URL.',
      );
      return this.getPublicUrl(filePath, targetBucket);
    }

    const cleanUrl = supabaseUrl.replace(/\/+$/, '');
    const endpoint = `${cleanUrl}/storage/v1/object/${targetBucket}/${filePath}`;
    const contentType = options?.contentType || 'application/octet-stream';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${supabaseKey}`,
          apikey: supabaseKey,
          'Content-Type': contentType,
          'x-upsert': 'true',
        },
        body: new Uint8Array(fileBuffer),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`Supabase storage upload failed: ${response.status} ${errorText}`);
        throw new InternalServerErrorException(`Failed to upload file to storage: ${errorText}`);
      }

      return this.getPublicUrl(filePath, targetBucket);
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      this.logger.error('Error during Supabase file upload', error);
      throw new InternalServerErrorException('Storage service upload error');
    }
  }

  async delete(filePath: string, bucket?: string): Promise<void> {
    const targetBucket = bucket || this.config.storage.supabaseBucket || 'media';
    const supabaseUrl = this.config.storage.supabaseUrl;
    const supabaseKey = this.config.storage.supabaseKey;

    if (!supabaseUrl || !supabaseKey) {
      this.logger.warn('Supabase URL or Key not configured. Skipping delete.');
      return;
    }

    const cleanUrl = supabaseUrl.replace(/\/+$/, '');
    const endpoint = `${cleanUrl}/storage/v1/object/${targetBucket}/${filePath}`;

    try {
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${supabaseKey}`,
          apikey: supabaseKey,
        },
      });

      if (!response.ok && response.status !== 404) {
        const errorText = await response.text();
        this.logger.error(`Supabase storage delete failed: ${response.status} ${errorText}`);
      }
    } catch (error) {
      this.logger.error('Error during Supabase file delete', error);
    }
  }
}
