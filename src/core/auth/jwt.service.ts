import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { CoreConfigService } from '@app/core/config/config.service';
import { AuthConfig } from '@app/config/auth.config';
import { BaseJwtPayload } from './jwt-base-payload.interface';

@Injectable()
export class JwtService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessTtl: string;
  private readonly refreshTtl: string;

  constructor(private readonly config: CoreConfigService) {
    const authConfig = this.config.get<AuthConfig>('auth')!;

    this.accessSecret = authConfig.jwtAccessSecret;
    this.refreshSecret = authConfig.jwtRefreshSecret;
    this.accessTtl = authConfig.jwtAccessExpiresIn;
    this.refreshTtl = authConfig.jwtRefreshExpiresIn;
  }

  signAccess(payload: BaseJwtPayload, ttl = '15m') {
    return jwt.sign(payload, this.accessSecret, { expiresIn: this.accessTtl });
  }

  signRefresh(payload: any, ttl = '30d') {
    return jwt.sign(payload, this.refreshSecret, { expiresIn: this.refreshTtl });
  }

  verifyAccess(token: string) {
    return jwt.verify(token, this.accessSecret);
  }

  verifyRefresh(token: string) {
    return jwt.verify(token, this.refreshSecret);
  }
}
