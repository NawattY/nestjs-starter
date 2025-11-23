import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthPrismaDataSource } from './datasources/auth.prisma.datasource';
import { AUTH_DATASOURCE } from './datasources/auth.datasource.interface';
import { CrossBusinessModule } from '#business/business.module';

@Module({
  providers: [
    AuthService,
    {
      provide: AUTH_DATASOURCE,
      useClass: AuthPrismaDataSource,
    },
  ],
  imports: [CrossBusinessModule],
  exports: [AuthService],
})
export class AuthModule {}
