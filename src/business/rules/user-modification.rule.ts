import { Injectable } from '@nestjs/common';
import { PrismaService } from '#core/database/prisma.service';
import { BusinessException } from '../exceptions/business.exception';

@Injectable()
export class UserModificationRule {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Validates if a user can be modified.
   * Example rule: Cannot modify a user if they are suspended (status = 'suspended').
   */
  async validate(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { status: true },
    });

    if (!user) {
      // Let the service handle 'Not Found', or throw here if strict.
      return;
    }

    if (user.status === 'suspended') {
      BusinessException.userSuspended();
    }
  }
}
