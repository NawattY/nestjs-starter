import { Injectable } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { CoreConfigService } from '@app/core/config/config.service';
import { LoggerService } from '@app/core/logger/services/logger.service';
import { RedisConfig } from '@app/config/redis.config';

@Injectable()
export class RedisService {
  private client: RedisClientType | null = null;
  private enabled = false;

  constructor(
    private readonly config: CoreConfigService,
    private readonly logger: LoggerService,
  ) {
    const redis = this.config.get<RedisConfig>('redis')!;
    this.enabled = redis.enabled;
  }

  private async getClient() {
    if (!this.enabled) return null;

    if (!this.client) {
      const redisConfig = this.config.get<RedisConfig>('redis')!;
      this.client = createClient({
        socket: {
          host: redisConfig.host,
          port: redisConfig.port,
        },
        password: redisConfig.password,
        database: redisConfig.db,
      });

      this.client.on('error', (err) => {
        this.logger.error(
          `[Redis] Connection Error`,
          err?.stack,
          'RedisService',
        );
      });

      try {
        await this.client.connect();
      } catch (err: any) {
        this.logger.error(
          '[Redis] Failed to connect',
          err?.stack,
          'RedisService',
        );
        throw err;
      }
    }

    return this.client;
  }

  async get(key: string): Promise<string | null> {
    const client = await this.getClient();
    if (!client) return null;
    return client.get(key);
  }

  async set(key: string, value: string, ttl?: number) {
    const client = await this.getClient();
    if (!client) return;

    try {
      if (ttl) {
        await client.set(key, value, { EX: ttl });
      } else {
        await client.set(key, value);
      }
    } catch (err: any) {
      this.logger.error(
        `[Redis] Failed to set key "${key}"`,
        err?.stack,
        'RedisService',
      );
    }
  }

  async del(key: string) {
    const client = await this.getClient();
    if (!client) return;

    try {
      return client.del(key);
    } catch (err: any) {
      this.logger.error(
        `[Redis] Failed to delete key "${key}"`,
        err?.stack,
        'RedisService',
      );
    }
  }
}
