import { Inject, Injectable } from '@nestjs/common';
import { CacheAdapter } from './interfaces/cache.interface';

@Injectable()
export class CacheService {
  constructor(
    @Inject('CACHE_ADAPTER')
    private readonly adapter: CacheAdapter,
  ) {}

  get<T>(key: string) {
    return this.adapter.get<T>(key);
  }

  set<T>(key: string, value: T, ttl?: number) {
    return this.adapter.set(key, value, ttl);
  }

  del(key: string) {
    return this.adapter.del(key);
  }
}
