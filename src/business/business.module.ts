import { Module } from '@nestjs/common';
import { CoreDatabaseModule } from '#core/database/database.module';
import { UserModificationRule } from './rules/user-modification.rule';

@Module({
  imports: [
    CoreDatabaseModule, // Allow access to PrismaService
  ],
  providers: [
    UserModificationRule,
  ],
  exports: [
    UserModificationRule,
  ],
})
export class CrossBusinessModule {}
