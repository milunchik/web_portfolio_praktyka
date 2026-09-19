import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ERROR_CODES } from '../errors';
import { TokenPort } from '../domain/ports';
import { HEADERS } from '../constants';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly tokenPort: TokenPort) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const auth = req.headers[HEADERS.AUTHORIZATION];

    if (typeof auth !== 'string' || !auth.startsWith('Bearer ')) {
      throw new UnauthorizedException({
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'Authorization token missing',
      });
    }

    const token = auth.slice('Bearer '.length).trim();

    try {
      const payload = this.tokenPort.verifyAccessToken(token);
      req.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException({
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'Invalid or expired token',
      });
    }
  }
}
