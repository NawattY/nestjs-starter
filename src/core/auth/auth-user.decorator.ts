import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import type { Request } from 'express';

import type { BaseJwtPayload } from './jwt-base-payload.interface';

type AuthenticatedRequest = Request & {
  user?: BaseJwtPayload;
};

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): BaseJwtPayload => {
    const req = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return req.user as BaseJwtPayload;
  },
);
