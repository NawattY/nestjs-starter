import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { BaseJwtPayload } from './jwt-base-payload.interface';

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): BaseJwtPayload => {
    const req = ctx.switchToHttp().getRequest();
    return req.user as BaseJwtPayload;
  },
);
