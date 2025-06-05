import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../dtos/responses/user-response.dto';
import { PaginatedResultInterface } from '#shared/interfaces/paginated-result.interface';
import { UserQueryDto } from '../dtos/requests/user-query.dto';
import { UserDao } from '../data-access/user.dao';

@Injectable()
export class UserService {
  constructor(private readonly userDAO: UserDao) {}

  async findAll(
    query: UserQueryDto,
  ): Promise<PaginatedResultInterface<UserResponseDto>> {
    const result = await this.userDAO.findAll(query);

    return {
      items: plainToInstance(UserResponseDto, result.items),
      meta: {
        itemCount: result.meta.itemCount,
        totalItems: result.meta.totalItems ?? 0,
        itemsPerPage: result.meta.itemsPerPage,
        totalPages: result.meta.totalPages ?? 0,
        currentPage: result.meta.currentPage,
      },
      links: result.links,
    };
  }
}
