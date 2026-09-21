import type {
  SafeUser,
  CvDisplayOptions,
  UpdateEmailRequest,
  ChangePasswordRequest,
  MessageResponse,
} from '@repo/contracts';

export type {
  SafeUser,
  CvDisplayOptions,
  UpdateEmailRequest,
  ChangePasswordRequest,
  MessageResponse,
};

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
