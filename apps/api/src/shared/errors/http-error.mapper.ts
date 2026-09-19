import { HttpStatus } from '@nestjs/common';
import { AppError } from './app-error';
import { ERROR_CODES } from './error-codes';

export type HttpMappedError = {
  statusCode: number;
  code: string;
  message: string;
  details?: Record<string, unknown>;
};

export const mapAppErrorToHttp = (err: AppError): HttpMappedError => {
  switch (err.code) {
    case ERROR_CODES.VALIDATION_FAILED:
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        code: err.code,
        message: err.message,
        details: err.details,
      };

    case ERROR_CODES.UNAUTHORIZED:
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        code: err.code,
        message: err.message,
        details: err.details,
      };

    case ERROR_CODES.FORBIDDEN:
      return {
        statusCode: HttpStatus.FORBIDDEN,
        code: err.code,
        message: err.message,
        details: err.details,
      };

    case ERROR_CODES.NOT_FOUND:
    case ERROR_CODES.USER_NOT_FOUND:
      return {
        statusCode: HttpStatus.NOT_FOUND,
        code: err.code,
        message: err.message,
        details: err.details,
      };

    case ERROR_CODES.CONFLICT:
    case ERROR_CODES.USER_ALREADY_EXISTS:
      return {
        statusCode: HttpStatus.CONFLICT,
        code: err.code,
        message: err.message,
        details: err.details,
      };

    case ERROR_CODES.BAD_REQUEST:
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        code: err.code,
        message: err.message,
        details: err.details,
      };

    default:
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        code: err.code,
        message: err.message,
        details: err.details,
      };
  }
};
