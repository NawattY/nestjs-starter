import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import type { PrismaDatabaseConfig } from '../../config/database.config';
import { CoreConfigService } from '../config/config.service';
import { DatabaseException } from './database.exception';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private isConnected = false;
  private connectPromise: Promise<void> | null = null;

  constructor(private readonly configService: CoreConfigService) {
    super();
  }

  async onModuleInit() {
    const databaseConfig = this.configService.get<PrismaDatabaseConfig>('database');

    if (!databaseConfig?.url || !databaseConfig.connectOnBoot) {
      return;
    }

    await this.ensureConnection();
  }

  hasDatabaseUrl(): boolean {
    const databaseConfig = this.configService.get<PrismaDatabaseConfig>('database');
    return Boolean(databaseConfig?.url);
  }

  async ensureConnection(): Promise<void> {
    if (!this.hasDatabaseUrl()) {
      DatabaseException.unavailable();
    }

    if (this.isConnected) {
      return;
    }

    this.connectPromise ??= this.$connect()
      .then(() => {
        this.isConnected = true;
      })
      .finally(() => {
        this.connectPromise = null;
      });

    await this.connectPromise;
  }

  enableShutdownHooks(app: INestApplication): void {
    process.once('beforeExit', () => {
      void app.close();
    });
  }
}
