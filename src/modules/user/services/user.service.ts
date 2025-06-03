import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';

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
}
