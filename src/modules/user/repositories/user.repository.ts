import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { PaginatedRequestInterface } from '#shared/interfaces/paginated-request.interface';

export interface FindUserOptions extends PaginatedRequestInterface {
  email?: string;
  mobile?: string;
  isActive?: boolean;
  fullName?: string;
}

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.repo.findOne({ where: { email } });
  }

  async findByMobile(mobile: string): Promise<UserEntity | null> {
    return this.repo.findOne({ where: { mobile } });
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.repo.findOne({ where: { id } });
  }

  async create(userData: Partial<UserEntity>): Promise<UserEntity> {
    const user = this.repo.create(userData);
    return this.repo.save(user);
  }

  async findAll(query: FindUserOptions): Promise<Pagination<UserEntity>> {
    const queryBuilder = this.repo.createQueryBuilder('user');

    if (query.email) {
      queryBuilder.andWhere('user.email = :email', { email: query.email });
    }

    if (query.mobile) {
      queryBuilder.andWhere('user.mobile = :mobile', { mobile: query.mobile });
    }

    if (query.isActive !== undefined) {
      queryBuilder.andWhere('user.isActive = :isActive', {
        isActive: query.isActive,
      });
    }

    if (query.fullName) {
      queryBuilder.andWhere('LOWER(user.fullName) LIKE :fullName', {
        fullName: `%${query.fullName.toLocaleLowerCase()}%`,
      });
    }

    const page = query.page;
    const limit = query.perPage;

    return await paginate<UserEntity>(queryBuilder, {
      page,
      limit,
    });
  }
}
