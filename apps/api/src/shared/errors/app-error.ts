import { ErrorCode, ERROR_CODES } from './error-codes';

export type AppErrorDetails = Record<string, unknown>;

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly details?: AppErrorDetails;

  constructor(params: {
    code: ErrorCode;
    message: string;
    details?: AppErrorDetails;
  }) {
    super(params.message);
    this.name = 'AppError';
    this.code = params.code;
    this.details = params.details;
  }

  static internal(message = 'Internal error', details?: AppErrorDetails) {
    return new AppError({ code: ERROR_CODES.INTERNAL_ERROR, message, details });
  }
}
