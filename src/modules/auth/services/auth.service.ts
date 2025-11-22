import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '#core/auth/jwt.service';
import { AUTH_DATASOURCE, AuthDataSource } from '../datasources/auth.datasource.interface';
import { JwtPayload } from '../rbac/jwt-payload.interface';
import { UserAuthEntity } from '../entities/user-auth.entity';
import { AuthOutput } from '../models/auth.output';
import { AuthException } from '../exceptions/auth.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    @Inject(AUTH_DATASOURCE)
    private readonly ds: AuthDataSource,
  ) {}

  async loginWithPassword(mobile: string, password: string, agent: any): Promise<AuthOutput> {
    const user = await this.ds.findUserByMobile(mobile);
    if (!user || !user.hasPassword) AuthException.credentialMismatch();

    await this.validatePassword(user, password);
    return this.issueSession(user.userId, agent);
  }

  private async validatePassword(user: UserAuthEntity, password: string): Promise<void> {
    if (!user.password || !await bcrypt.compare(password, user.password)) {
      AuthException.credentialMismatch();
    }
  }

  private async issueSession(userId: string, agent: any): Promise<AuthOutput> {
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

  async refresh(refreshToken: string, agent: any): Promise<AuthOutput> {
    let payload: any;

    try {
      payload = this.jwt.verifyRefresh(refreshToken);
    } catch {
      AuthException.invalidRefreshToken();
    }

    const session = await this.ds.findSession(payload.sid);
    if (!session || !session.isActive()) AuthException.unauthorized();

    const ok = await bcrypt.compare(refreshToken, session.refreshTokenHash);
    if (!ok) {
      await this.ds.revokeSession(payload.sid);
      AuthException.invalidRefreshToken();
    }

    return this.issueSession(payload.uid, agent);
  }

  async logout(sid: string): Promise<void> {
    try {
      await this.ds.revokeSession(sid);
    } catch {}
  }

  async getUserById(id: string): Promise<UserAuthEntity> {
    const user = await this.ds.findUserById(id);
    if (!user || !user.hasPassword) AuthException.unauthorized();

    return user;
  }
}
