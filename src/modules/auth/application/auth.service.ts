import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { JwtService } from '../../../core/auth/jwt.service';
import type { BaseJwtPayload } from '../../../core/auth/jwt-base-payload.interface';
import { JwtPayload } from '../../../core/auth/jwt-payload.interface';
import { UserAuthEntity } from '../domain/entities/user-auth.entity';
import { AuthException } from '../exceptions/auth.exception';
import {
  AUTH_DATASOURCE,
  AuthDataSource,
} from '../infrastructure/datasources/auth.datasource.interface';
import { LoginInput } from './models/inputs/login.input';
import { RefreshTokenInput } from './models/inputs/refresh-token.input';
import { AuthOutput } from './models/outputs/auth.output';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    @Inject(AUTH_DATASOURCE)
    private readonly ds: AuthDataSource,
  ) {}

  async loginWithPassword(input: LoginInput): Promise<AuthOutput> {
    const user = await this.ds.findUserByMobile(input.mobile);
    if (!user?.hasPassword) AuthException.credentialMismatch();

    await this.validatePassword(user, input.password);
    return this.issueSession(user.userId, { ip: input.ip, userAgent: input.userAgent });
  }

  private async validatePassword(user: UserAuthEntity, password: string): Promise<void> {
    if (!user.password || !(await bcrypt.compare(password, user.password))) {
      AuthException.credentialMismatch();
    }
  }

  private async issueSession(
    userId: string,
    agent: { ip: string; userAgent: string },
  ): Promise<AuthOutput> {
    const sessionId = crypto.randomUUID();

    const refreshToken = this.jwt.signRefresh({ sid: sessionId, uid: userId });
    const salt = await bcrypt.genSalt();
    const refreshHash = await bcrypt.hash(refreshToken, salt);

    const newSession = await this.ds.createSession(
      userId,
      refreshHash,
      sessionId,
      agent.userAgent,
      agent.ip,
    );

    const payload: JwtPayload = {
      uid: userId,
      sid: newSession.id,
      roles: [],
    };

    const accessToken = this.jwt.signAccess(payload);

    return { accessToken, refreshToken };
  }

  async refresh(input: RefreshTokenInput): Promise<AuthOutput> {
    let payload: BaseJwtPayload;

    try {
      payload = this.jwt.verifyRefresh(input.refreshToken);
    } catch {
      AuthException.invalidRefreshToken();
    }

    const session = await this.ds.findSession(payload.sid);
    if (!session?.isActive()) AuthException.unauthorized();

    const ok = await bcrypt.compare(input.refreshToken, session.refreshTokenHash);
    if (!ok) {
      await this.ds.revokeSession(payload.sid);
      AuthException.invalidRefreshToken();
    }

    return this.issueSession(payload.uid, { ip: input.ip, userAgent: input.userAgent });
  }

  async logout(sid: string): Promise<void> {
    try {
      await this.ds.revokeSession(sid);
    } catch {
      return;
    }
  }

  async getUserById(id: string): Promise<UserAuthEntity> {
    const user = await this.ds.findUserById(id);
    if (!user?.hasPassword) AuthException.unauthorized();

    return user;
  }
}
