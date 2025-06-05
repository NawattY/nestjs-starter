import { Injectable } from '@nestjs/common';
import { UserException } from '../exceptions/user.exception';
import { UserRepository } from '../repositories/user.repository';
import { UserEntity } from '../entities/user.entity';
import { UserQueryDto } from '../dtos/requests/user-query.dto';
import { Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class UserDao {
  constructor(private readonly userRepository: UserRepository) {}

  async findByEmailOrFail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findByEmail(email);
    return this.checkUser(user);
  }

  async findByMobileOrFail(mobile: string): Promise<UserEntity> {
    const user = await this.userRepository.findByMobile(mobile);
    return this.checkUser(user);
  }

  async findByIdOrFail(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);
    return this.checkUser(user);
  }

  async findByUsernameOfFail(username: string): Promise<UserEntity> {
    if (username.includes('@')) {
      return await this.findByEmailOrFail(username);
    } else {
      return await this.findByMobileOrFail(username);
    }
  }

  async findAll(query: UserQueryDto): Promise<Pagination<UserEntity>> {
    return await this.userRepository.findAll(query);
  }

  private checkUser(user: UserEntity | null) {
    if (!user) {
      UserException.notFound();
    }

    return user;
  }
}
