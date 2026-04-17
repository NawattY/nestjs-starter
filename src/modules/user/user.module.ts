import { Module } from '@nestjs/common';

import { UserController } from './api/controllers/user.controller';
import { UserModificationRule } from './application/rules/user-modification.rule';
import { UserService } from './application/user.service';
import { USER_DATASOURCE } from './infrastructure/datasources/user.datasource.interface';
import { UserPrismaDataSource } from './infrastructure/datasources/user.prisma.datasource';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    UserModificationRule,
    {
      provide: USER_DATASOURCE,
      useClass: UserPrismaDataSource,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
