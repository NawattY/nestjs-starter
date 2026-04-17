import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import type { User, UserSession } from '@prisma/client';

import { PrismaService } from '../../../../core/database/prisma.service';
import { SessionEntity } from '../../domain/entities/session.entity';
import { UserAuthEntity } from '../../domain/entities/user-auth.entity';
import { AuthDataSource } from './auth.datasource.interface';

@Injectable()
export class AuthPrismaDataSource implements AuthDataSource {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
    private readonly prismaService: PrismaService,
  ) {}

  private async ensureDatabaseConnection(): Promise<void> {
    await this.prismaService.ensureConnection();
  }

  private toUserEntity(user: User): UserAuthEntity {
    return new UserAuthEntity(
      user.id,
      user.mobile,
      user.email,
      user.password,
      null,
      null,
      !!user.password,
    );
  }

  private toSessionEntity(session: UserSession): SessionEntity {
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

  async findUserById(id: string) {
    await this.ensureDatabaseConnection();
    const user = await this.txHost.tx.user.findUnique({ where: { id } });
    return user ? this.toUserEntity(user) : null;
  }

  async findUserByMobile(mobile: string) {
    await this.ensureDatabaseConnection();
    const user = await this.txHost.tx.user.findUnique({ where: { mobile } });
    return user ? this.toUserEntity(user) : null;
  }

  async createSession(userId: string, hash: string, sessionId: string, ua?: string, ip?: string) {
    await this.ensureDatabaseConnection();
    const session = await this.txHost.tx.userSession.create({
      data: {
        id: sessionId,
        userId,
        refreshTokenHash: hash,
        userAgent: ua ?? null,
        ipAddress: ip ?? null,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      },
    });

    return this.toSessionEntity(session);
  }

  async findSession(id: string) {
    await this.ensureDatabaseConnection();
    const session = await this.txHost.tx.userSession.findUnique({ where: { id } });
    return session ? this.toSessionEntity(session) : null;
  }

  async replaceSession(oldId: string, newSession: SessionEntity) {
    await this.ensureDatabaseConnection();
    await this.txHost.withTransaction(async () => {
      await this.txHost.tx.userSession.update({
        where: { id: oldId },
        data: { replacedAt: new Date() },
      });

      await this.txHost.tx.userSession.create({
        data: {
          id: newSession.id,
          userId: newSession.userId,
          refreshTokenHash: newSession.refreshTokenHash,
          expiresAt: newSession.expiresAt,
          userAgent: newSession.userAgent,
          ipAddress: newSession.ipAddress,
        },
      });
    });
  }

  async revokeSession(id: string) {
    await this.ensureDatabaseConnection();
    await this.txHost.tx.userSession.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }
}
