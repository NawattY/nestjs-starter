import { Module } from '@nestjs/common';

import { AuthController } from './api/controllers/auth.controller';
import { AuthService } from './application/auth.service';
import { AUTH_DATASOURCE } from './infrastructure/datasources/auth.datasource.interface';
import { AuthPrismaDataSource } from './infrastructure/datasources/auth.prisma.datasource';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: AUTH_DATASOURCE,
      useClass: AuthPrismaDataSource,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
