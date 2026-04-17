import { Injectable } from '@nestjs/common';
import { CacheAdapter } from './interfaces/cache.interface';
import { RedisService } from '@app/core/redis/redis.service';

@Injectable()
export class RedisCacheAdapter implements CacheAdapter {
  constructor(private readonly redis: RedisService) {}

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set<T>(key: string, value: T, ttl?: number) {
    await this.redis.set(key, JSON.stringify(value), ttl);
  }

  async del(key: string) {
    await this.redis.del(key);
  }
}
