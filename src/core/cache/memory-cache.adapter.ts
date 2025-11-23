import { Injectable } from '@nestjs/common';
import { CacheAdapter } from './interfaces/cache.interface';

@Injectable()
export class MemoryCacheAdapter implements CacheAdapter {
  private store = new Map<string, { value: any; expiresAt: number | null }>();

  async get<T>(key: string): Promise<T | null> {
    const item = this.store.get(key);
    if (!item) return null;

    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return item.value as T;
  }

  async set<T>(key: string, value: T, ttl?: number) {
    this.store.set(key, {
      value,
      expiresAt: ttl ? Date.now() + ttl * 1000 : null,
    });
  }

  async del(key: string) {
    this.store.delete(key);
  }
}
