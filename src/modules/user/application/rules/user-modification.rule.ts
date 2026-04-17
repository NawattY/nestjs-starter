import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

import { PrismaService } from '../../../../core/database/prisma.service';
import { UserException } from '../../exceptions/user.exception';

@Injectable()
export class UserModificationRule {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
    private readonly prismaService: PrismaService,
  ) {}

  async validate(userId: string): Promise<void> {
    await this.prismaService.ensureConnection();

    const user = await this.txHost.tx.user.findUnique({
      where: { id: userId },
      select: { status: true },
    });

    if (!user) {
      return;
    }

    if (user.status === 'suspended') {
      UserException.userSuspended();
    }
  }
}
