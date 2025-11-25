import { Injectable } from '@nestjs/common';
import { PrismaService } from '#core/database/prisma.service';
import { User } from '@prisma/client';
import { UserDatasourceInterface } from './user.datasource.interface';
import { UserEntity } from '../entities/user.entity';
import { FindUsersInput } from '../models/find-users.input';
import { prismaPaginate } from '#shared/helpers/prisma-paginate.helper';
import { PaginatedResultInterface } from '#shared/interfaces/paginated-result.interface';

@Injectable()
export class UserPrismaDataSource implements UserDatasourceInterface {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(input: FindUsersInput): Promise<PaginatedResultInterface<UserEntity>> {
    const result = await prismaPaginate(this.prisma.user, {
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
    const user = await this.prisma.user.findUnique({ where: { id } });

    return user ? this.transformUserEntity(user) : null;
  }

  async update(
    id: string,
    data: { email?: string; firstName?: string; lastName?: string },
  ): Promise<UserEntity> {
    const user = await this.prisma.user.update({
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
