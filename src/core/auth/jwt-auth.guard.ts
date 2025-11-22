import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { JwtService } from './jwt.service';
import { BaseJwtPayload } from './jwt-base-payload.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith('Bearer ')) {
      return false;
    }

    const token = auth.split(' ')[1];

    try {
      const payload = this.jwt.verifyAccess(token) as BaseJwtPayload;
      req.user = payload;
      return true;
    } catch {
      return false;
    }
  }
}
