import { AppError } from './app-error';
import { ERROR_CODES } from './error-codes';

export const DomainErrors = {
  userAlreadyExists: (email: string) =>
    new AppError({
      code: ERROR_CODES.USER_ALREADY_EXISTS,
      message: 'User already exists',
      details: { email },
    }),

  userNotFound: (id: string) =>
    new AppError({
      code: ERROR_CODES.USER_NOT_FOUND,
      message: 'User not found',
      details: { id },
    }),
} as const;
