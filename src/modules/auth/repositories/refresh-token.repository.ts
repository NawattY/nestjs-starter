import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshTokenEntity } from '../entities/refresh-token.entity';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly repo: Repository<RefreshTokenEntity>,
  ) {}

  async createToken(userId: string, token: string): Promise<RefreshTokenEntity> {
    const entity = this.repo.create({ userId, token });
    return this.repo.save(entity);
  }

  async findByToken(token: string): Promise<RefreshTokenEntity | null> {
    return this.repo.findOne({ where: { token } });
  }
}
