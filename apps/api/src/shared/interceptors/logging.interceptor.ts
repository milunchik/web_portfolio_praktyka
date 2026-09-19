import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import type { Request, Response } from 'express';

import { AppLogger } from '../../infrastructure/logger/logger.service';
import { HEADERS } from '../constants';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();

    const method = req.method;
    const url = req.originalUrl ?? req.url;
    const start = Date.now();

    const requestIdHeader = req.headers[HEADERS.REQUEST_ID];
    const requestId =
      typeof requestIdHeader === 'string'
        ? requestIdHeader
        : Array.isArray(requestIdHeader)
          ? requestIdHeader[0]
          : undefined;

    if (requestId) {
      res.setHeader(HEADERS.REQUEST_ID, requestId);
    }

    return next.handle().pipe(
      tap({
        next: () => {
          const ms = Date.now() - start;
          this.logger.log(
            `${method} ${url} ${ms}ms`,
            requestId ? `requestId=${requestId}` : undefined,
          );
        },
        error: (err: unknown) => {
          const ms = Date.now() - start;
          this.logger.error(
            `${method} ${url} ${ms}ms`,
            err instanceof Error ? (err.stack ?? err.message) : String(err),
            requestId ? `requestId=${requestId}` : undefined,
          );
        },
      }),
    );
  }
}
