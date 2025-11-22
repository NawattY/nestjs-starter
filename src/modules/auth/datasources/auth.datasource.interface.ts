import { SessionEntity } from "../entities/session.entity";
import { UserAuthEntity } from "../entities/user-auth.entity";


export const AUTH_DATASOURCE = 'AuthDataSource';

export interface AuthDataSource {
  findUserByMobile(mobile: string): Promise<UserAuthEntity | null>;
  findUserById(id: string): Promise<UserAuthEntity | null>;

  createSession(
    userId: string,
    refreshTokenHash: string,
    sessionId: string,
    userAgent?: string,
    ipAddress?: string
  ): Promise<SessionEntity>;

  findSession(sessionId: string): Promise<SessionEntity | null>;
  replaceSession(oldId: string, newSession: SessionEntity): Promise<void>;
  revokeSession(sessionId: string): Promise<void>;
}
