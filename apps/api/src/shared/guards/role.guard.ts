import {
    CanActivate,
    ExecutionContext, ForbiddenException,
    Injectable,
} from '@nestjs/common';
import type { Request } from 'express';
import { Reflector } from '@nestjs/core';
import {Role} from "@prisma/client";
import { ROLES_KEY } from '../decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        if(!requiredRoles || requiredRoles.length === 0) return true;

        const request = context.switchToHttp().getRequest<Request>();
        const user = request.user;

        if (!user || !user.role) {
            throw new ForbiddenException('Access denied');
        }

        if (!requiredRoles.includes(user.role)) {
            throw new ForbiddenException('Insufficient permissions');
        }

        return true;
    }
}