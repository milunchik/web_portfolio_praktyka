import type { SafeUser, CvDisplayOptions } from '@repo/contracts';

export type { SafeUser, CvDisplayOptions };

export interface UpdateUserRequest {
  email?: string;
  password?: string;
  fullName?: string;
  publicUrl?: string;
  description?: string;
  fileName?: string | null;
  cvOptions?: CvDisplayOptions | null;
}
