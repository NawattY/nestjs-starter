import { Module } from '@nestjs/common';
import { CrossBusinessModule } from '#business/business.module';
import { UserService } from './services/user.service';
import { UserPrismaDataSource } from './datasources/user.prisma.datasource';
import { USER_DATASOURCE } from './datasources/user.datasource.interface';

@Module({
  imports: [CrossBusinessModule],
  providers: [
    UserService,
    {
      provide: USER_DATASOURCE,
      useClass: UserPrismaDataSource,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
