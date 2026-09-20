import type { Media } from '@repo/contracts';

export type { Media };

export interface CreateMediaRequest {
  url: string;
  fileName: string;
  mimeType: string;
  size?: number;
}

export interface UpdateMediaRequest {
  url?: string;
  fileName?: string;
  mimeType?: string;
  size?: number;
}
