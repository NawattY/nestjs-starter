import { Injectable } from '@nestjs/common';
import type { SignOptions } from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken';

import { AuthConfig } from '../../config/auth.config';
import { CoreConfigService } from '../config/config.service';
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
    const expiresIn = ttl || this.accessTtl;
    return jwt.sign(payload, this.accessSecret, {
      expiresIn: expiresIn as SignOptions['expiresIn'],
    });
  }

  signRefresh(payload: BaseJwtPayload, ttl = '30d') {
    const expiresIn = ttl || this.refreshTtl;
    return jwt.sign(payload, this.refreshSecret, {
      expiresIn: expiresIn as SignOptions['expiresIn'],
    });
  }

  verifyAccess(token: string): BaseJwtPayload {
    return jwt.verify(token, this.accessSecret) as BaseJwtPayload;
  }

  verifyRefresh(token: string): BaseJwtPayload {
    return jwt.verify(token, this.refreshSecret) as BaseJwtPayload;
  }
}
