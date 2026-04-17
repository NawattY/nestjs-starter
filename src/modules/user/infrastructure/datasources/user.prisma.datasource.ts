import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { prismaPaginate } from '@app/shared/helpers/prisma-paginate.helper';
import { PaginatedResultInterface } from '@app/shared/interfaces/paginated-result.interface';

import { FindUsersInput } from '../../application/models/inputs/find-users.input';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserDatasourceInterface } from './user.datasource.interface';

@Injectable()
export class UserPrismaDataSource implements UserDatasourceInterface {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  async findAll(input: FindUsersInput): Promise<PaginatedResultInterface<UserEntity>> {
    const result = await prismaPaginate(this.txHost.tx.user, {
      page: input.page,
      perPage: input.perPage,
      orderBy: { createdAt: 'desc' },
    });

    return {
      items: result.items.map((user) => this.transformUserEntity(user)),
      meta: result.meta,
    };
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.txHost.tx.user.findUnique({ where: { id } });

    return user ? this.transformUserEntity(user) : null;
  }

  async update(
    id: string,
    data: { email?: string; firstName?: string; lastName?: string },
  ): Promise<UserEntity> {
    const user = await this.txHost.tx.user.update({
      where: { id },
      data: {
        ...(data.email !== undefined && { email: data.email }),
        ...(data.firstName !== undefined && { firstName: data.firstName }),
        ...(data.lastName !== undefined && { lastName: data.lastName }),
        updatedAt: new Date(),
      },
    });

    return this.transformUserEntity(user);
  }

  private transformUserEntity(user: User) {
    return new UserEntity(
      user.id,
      user.mobile,
      user.email,
      user.password,
      null,
      user.status === 'active',
      user.createdAt,
      user.updatedAt,
    );
  }
}