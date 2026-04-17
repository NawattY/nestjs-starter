import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

import { UserException } from '@app/modules/user/exceptions/user.exception';

@Injectable()
export class UserModificationRule {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  async validate(userId: string): Promise<void> {
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