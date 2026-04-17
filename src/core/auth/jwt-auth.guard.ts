import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { Request } from 'express';

import { JwtService } from './jwt.service';
import { BaseJwtPayload } from './jwt-base-payload.interface';

type AuthenticatedRequest = Request & {
  user?: BaseJwtPayload;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const auth = req.headers.authorization;

    if (!auth?.startsWith('Bearer ')) {
      return false;
    }

    const token = auth.slice('Bearer '.length);
    if (!token) {
      return false;
    }

    try {
      const payload = this.jwt.verifyAccess(token);
      req.user = payload;
      return true;
    } catch {
      return false;
    }
  }
}
