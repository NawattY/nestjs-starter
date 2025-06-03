import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserEntity } from '../entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../dtos/responses/user-response.dto';
import { PaginatedResultInterface } from '#common/interfaces/paginated-result.interface';
import { UserQueryDto } from '../dtos/requests/user-query.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepo.findByEmail(email);
  }

  async findById(id: string): Promise<UserEntity | null> {
    return await this.userRepo.findById(id);
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    if (username.includes('@')) {
      return await this.findByEmail(username);
    } else {
      return await this.findById(username);
    }
  }

  async findAll(
    query: UserQueryDto,
  ): Promise<PaginatedResultInterface<UserResponseDto>> {
    const result = await this.userRepo.findAll(query);

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
