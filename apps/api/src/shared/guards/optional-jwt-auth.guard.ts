import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { TokenPort } from '../domain/ports';
import { HEADERS } from '../constants';

@Injectable()
export class OptionalJwtAuthGuard implements CanActivate {
  constructor(private readonly tokenPort: TokenPort) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const auth = req.headers[HEADERS.AUTHORIZATION];

    if (typeof auth === 'string' && auth.startsWith('Bearer ')) {
      const token = auth.slice('Bearer '.length).trim();
      try {
        const payload = this.tokenPort.verifyAccessToken(token);
        req.user = payload;
      } catch {
        // Optional auth: silent ignore invalid token
      }
    }

    return true;
  }
}
