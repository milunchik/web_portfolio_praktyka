export interface UploadFileOptions {
  bucket?: string;
  contentType?: string;
}

export abstract class StoragePort {
  abstract upload(
    filePath: string,
    fileBuffer: Buffer,
    options?: UploadFileOptions,
  ): Promise<string>;
  abstract delete(filePath: string, bucket?: string): Promise<void>;
  abstract getPublicUrl(filePath: string, bucket?: string): string;
}
