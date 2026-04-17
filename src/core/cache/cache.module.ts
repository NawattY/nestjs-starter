import { Global, Module } from '@nestjs/common';

import { CoreConfigService } from '../config/config.service';
import { RedisModule } from '../redis/redis.module';
import { RedisService } from '../redis/redis.service';
import { CacheService } from './cache.service';
import { MemoryCacheAdapter } from './memory-cache.adapter';
import { RedisCacheAdapter } from './redis-cache.adapter';

@Global()
@Module({
  imports: [RedisModule], // ✔ ต้อง import RedisModule ก่อน
  providers: [
    {
      provide: 'CACHE_ADAPTER',
      inject: [CoreConfigService, RedisService],
      useFactory: (config: CoreConfigService, redis: RedisService) => {
        const redisEnabled = config.get<boolean>('redis.enabled');

        // ✔ เลือก adapter ให้ถูกต้อง
        return redisEnabled
          ? new RedisCacheAdapter(redis) // pass RedisService
          : new MemoryCacheAdapter(); // fallback
      },
    },
    CacheService,
  ],
  exports: [CacheService],
})
export class CacheModule {}
