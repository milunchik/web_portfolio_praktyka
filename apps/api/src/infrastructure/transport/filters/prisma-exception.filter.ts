import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { HEADERS } from '../../../shared/constants';
import { ERROR_CODES } from '../../../shared/errors';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getMeta(
  exception: Prisma.PrismaClientKnownRequestError,
): Record<string, unknown> | undefined {
  const meta = exception.meta;
  return isRecord(meta) ? meta : undefined;
}

function getStringOrStringArray(value: unknown): string | string[] | undefined {
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && value.every((x) => typeof x === 'string'))
    return value;
  return undefined;
}

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const requestId = req.get(HEADERS.REQUEST_ID) ?? null;

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let code: string = ERROR_CODES.INTERNAL_ERROR;
    let message = 'Database error';
    let details: Record<string, unknown> | undefined = {
      prismaCode: exception.code,
    };

    const meta = getMeta(exception);

    switch (exception.code) {
      case 'P2002': {
        statusCode = HttpStatus.CONFLICT;
        code = ERROR_CODES.CONFLICT;
        message = 'Unique constraint failed';

        const target = getStringOrStringArray(meta?.['target']);
        details = { ...details, ...(target !== undefined ? { target } : {}) };
        break;
      }

      case 'P2025': {
        statusCode = HttpStatus.NOT_FOUND;
        code = ERROR_CODES.NOT_FOUND;
        message = 'Record not found';

        const cause =
          typeof meta?.['cause'] === 'string' ? meta['cause'] : undefined;
        details = { ...details, ...(cause !== undefined ? { cause } : {}) };
        break;
      }

      case 'P2003': {
        statusCode = HttpStatus.BAD_REQUEST;
        code = ERROR_CODES.BAD_REQUEST;
        message = 'Foreign key constraint failed';

        const fieldName =
          typeof meta?.['field_name'] === 'string'
            ? meta['field_name']
            : undefined;

        details = {
          ...details,
          ...(fieldName !== undefined ? { field_name: fieldName } : {}),
        };
        break;
      }

      default:
        break;
    }

    res.status(statusCode).json({
      statusCode,
      code,
      message,
      details,
      path: req.url,
      timestamp: new Date().toISOString(),
      requestId,
    });
  }
}
