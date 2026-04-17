import { Global, Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { RedisCacheAdapter } from './redis-cache.adapter';
import { MemoryCacheAdapter } from './memory-cache.adapter';
import { CoreConfigService } from '@app/core/config/config.service';
import { RedisService } from '@app/core/redis/redis.service';
import { RedisModule } from '@app/core/redis/redis.module';

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
          ? new RedisCacheAdapter(redis)   // pass RedisService
          : new MemoryCacheAdapter();      // fallback
      },
    },
    CacheService,
  ],
  exports: [CacheService],
})
export class CacheModule {}
