// src/core/config/config.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService as NestCoreConfigService } from '@nestjs/config';

@Injectable()
export class CoreConfigService {
  constructor(private readonly nestConfigService: NestCoreConfigService) {}

  get<T>(propertyPath: string): T | undefined {
    return this.nestConfigService.get<T>(propertyPath);
  }

  // ตัวอย่าง helper method ที่อาจจะมี
  getHost(): string {
    return (
      this.nestConfigService.get<string>('app.host') ??
      this.nestConfigService.get<string>('APP_HOST') ??
      'localhost'
    );
  }

  getPort(): number {
    return (
      this.nestConfigService.get<number>('app.port') ??
      this.nestConfigService.get<number>('APP_PORT') ??
      3000
    );
  }

  getName(): string {
    return (
      this.nestConfigService.get<string>('app.name') ??
      this.nestConfigService.get<string>('APP_NAME') ??
      ''
    );
  }

  getEnv(): string {
    return (
      this.nestConfigService.get<string>('app.env') ??
      this.nestConfigService.get<string>('NODE_ENV') ??
      'local'
    );
  }
  // ... other useful methods
}
