import { RedisConfig } from '@app/config/redis.config';
import { CoreConfigService } from '@app/core/config/config.service';
import { LoggerService } from '@app/core/logger/services/logger.service';
import { Injectable } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  private client: RedisClientType | null = null;
  private readonly enabled: boolean;

  constructor(
    private readonly config: CoreConfigService,
    private readonly logger: LoggerService,
  ) {
    const redis = this.config.get<RedisConfig>('redis')!;
    this.enabled = redis.enabled;
  }

  private static getErrorStack(error: unknown): string | undefined {
    return error instanceof Error ? error.stack : undefined;
  }

  private async getClient(): Promise<RedisClientType | null> {
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
          '[Redis] Connection Error',
          RedisService.getErrorStack(err),
          'RedisService',
        );
      });

      try {
        await this.client.connect();
      } catch (err: unknown) {
        this.logger.error(
          '[Redis] Failed to connect',
          RedisService.getErrorStack(err),
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

  async set(key: string, value: string, ttl?: number): Promise<void> {
    const client = await this.getClient();
    if (!client) return;

    try {
      if (ttl) {
        await client.set(key, value, { EX: ttl });
      } else {
        await client.set(key, value);
      }
    } catch (err: unknown) {
      this.logger.error(
        `[Redis] Failed to set key "${key}"`,
        RedisService.getErrorStack(err),
        'RedisService',
      );
    }
  }

  async del(key: string): Promise<number | void> {
    const client = await this.getClient();
    if (!client) return;

    try {
      return await client.del(key);
    } catch (err: unknown) {
      this.logger.error(
        `[Redis] Failed to delete key "${key}"`,
        RedisService.getErrorStack(err),
        'RedisService',
      );
    }
  }
}
