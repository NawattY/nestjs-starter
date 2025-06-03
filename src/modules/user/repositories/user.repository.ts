import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.repo.findOne({ where: { email } });
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.repo.findOne({ where: { id } });
  }

  async create(userData: Partial<UserEntity>): Promise<UserEntity> {
    const user = this.repo.create(userData);
    return this.repo.save(user);
  }
}
