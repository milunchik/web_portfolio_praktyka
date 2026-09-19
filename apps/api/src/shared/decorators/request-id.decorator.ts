import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { HEADERS } from '../constants';

export const RequestId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string | null => {
    const req = ctx.switchToHttp().getRequest<Request>();

    const byGetter = req.get(HEADERS.REQUEST_ID);
    if (typeof byGetter === 'string' && byGetter.length > 0) {
      return byGetter;
    }

    const raw = req.headers[HEADERS.REQUEST_ID];
    if (typeof raw === 'string' && raw.length > 0) {
      return raw;
    }
    if (Array.isArray(raw) && typeof raw[0] === 'string' && raw[0].length > 0) {
      return raw[0];
    }

    return null;
  },
);
