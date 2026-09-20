import type { SafeUser } from '@repo/contracts';

export type { SafeUser };

export interface UpdateUserRequest {
  email?: string;
  password?: string;
  fullName?: string;
  publicUrl?: string;
  description?: string;
  fileName?: string | null;
}
