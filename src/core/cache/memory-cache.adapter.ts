import { Injectable } from '@nestjs/common';

import { CacheAdapter } from './interfaces/cache.interface';

@Injectable()
export class MemoryCacheAdapter implements CacheAdapter {
  private readonly store = new Map<string, { value: unknown; expiresAt: number | null }>();

  get<T>(key: string): Promise<T | null> {
    const item = this.store.get(key);
    if (!item) return Promise.resolve(null);

    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.store.delete(key);
      return Promise.resolve(null);
    }

    return Promise.resolve(item.value as T);
  }

  set<T>(key: string, value: T, ttl?: number): Promise<void> {
    this.store.set(key, {
      value,
      expiresAt: ttl ? Date.now() + ttl * 1000 : null,
    });

    return Promise.resolve();
  }

  del(key: string): Promise<void> {
    this.store.delete(key);

    return Promise.resolve();
  }
}
