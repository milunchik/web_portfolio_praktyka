import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { randomUUID } from 'crypto';
import { HEADERS } from '../constants';
import type { Request, Response } from 'express';

@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<Request>();

    const res = context.switchToHttp().getResponse<Response>();

    let requestId = req.headers?.[HEADERS.REQUEST_ID] as string | undefined;
    if (!requestId) {
      requestId = randomUUID();
      req.headers[HEADERS.REQUEST_ID] = requestId;
    }

    res.setHeader(HEADERS.REQUEST_ID, requestId);
    return next.handle();
  }
}
