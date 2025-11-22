import { Injectable } from '@nestjs/common';
import { PrismaService } from '#core/database/prisma.service';
import { AuthDataSource } from './auth.datasource.interface';
import { UserAuthEntity } from '../entities/user-auth.entity';
import { SessionEntity } from '../entities/session.entity';

@Injectable()
export class AuthPrismaDataSource implements AuthDataSource {
  constructor(private prisma: PrismaService) {}

  private toUserEntity(user: any, provider?: any): UserAuthEntity {
    return new UserAuthEntity(
      user.id,
      user.mobile,
      user.email,
      user.password,
      provider?.displayName ?? null,
      provider?.providerUserId ?? null,
      !!user.password,
    );
  }

  private toSessionEntity(session: any) {
    return new SessionEntity(
      session.id,
      session.userId,
      session.refreshTokenHash,
      session.expiresAt,
      session.revokedAt,
      session.replacedAt,
      session.userAgent,
      session.ipAddress,
    );
  }

  // ---------------------- User ----------------------
  async findUserById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? this.toUserEntity(user) : null;
  }

  async findUserByMobile(mobile: string) {
    const user = await this.prisma.user.findUnique({ where: { mobile } });
    return user ? this.toUserEntity(user) : null;
  }

  // ---------------------- Session ----------------------

  async createSession(userId: string, hash: string, sessionId: string, ua?: string, ip?: string) {
    const s = await this.prisma.userSession.create({
      data: {
        id: sessionId,
        userId,
        refreshTokenHash: hash,
        userAgent: ua ?? null,
        ipAddress: ip ?? null,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      },
    });

    return this.toSessionEntity(s);
  }

  async findSession(id: string) {
    const s = await this.prisma.userSession.findUnique({ where: { id } });
    return s ? this.toSessionEntity(s) : null;
  }

  async replaceSession(oldId: string, newSession: SessionEntity) {
    await this.prisma.$transaction([
      this.prisma.userSession.update({
        where: { id: oldId },
        data: { replacedAt: new Date() },
      }),
      this.prisma.userSession.create({
        data: {
          id: newSession.id,
          userId: newSession.userId,
          refreshTokenHash: newSession.refreshTokenHash,
          expiresAt: newSession.expiresAt,
          userAgent: newSession.userAgent,
          ipAddress: newSession.ipAddress,
        },
      }),
    ]);
  }

  async revokeSession(id: string) {
    await this.prisma.userSession.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }
}
