import type { PrismaDatabaseConfig } from '@app/config/database.config';
import { CoreConfigService } from '@app/core/config/config.service';
import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly configService: CoreConfigService) {
    super();
  }

  async onModuleInit() {
    const databaseConfig = this.configService.get<PrismaDatabaseConfig>('database');

    if (!databaseConfig?.url || !databaseConfig.connectOnBoot) {
      return;
    }

    await this.$connect();
  }

  enableShutdownHooks(app: INestApplication): void {
    process.once('beforeExit', () => {
      void app.close();
    });
  }
}
