import type { SafeUser, CvDisplayOptions } from '@repo/contracts';

export type { SafeUser, CvDisplayOptions };

export interface UpdateUserRequest {
  email?: string;
  password?: string;
  fullName?: string;
  publicUrl?: string;
  description?: string | null;
  about?: string | null;
  fileName?: string | null;
  cvOptions?: CvDisplayOptions | null;
  location?: string | null;
  website?: string | null;
  github?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  dribbble?: string | null;
}
