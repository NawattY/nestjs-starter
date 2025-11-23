import { Inject, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { USER_DATASOURCE, UserDatasourceInterface } from '../datasources/user.datasource.interface';
import { UpdateUserInput } from '../models/update-user.input';
import { UserOutput } from '../models/user.output';
import { UserModificationRule } from '#business/rules/user-modification.rule';
import { UserUpdatedEvent } from '../events/user-updated.event';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_DATASOURCE)
    private readonly userDatasource: UserDatasourceInterface,
    private readonly userModificationRule: UserModificationRule,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  
  async getById(userId: string): Promise<UserOutput | null> {
    const user = await this.userDatasource.findById(userId);
    if (!user) return null;
    
    return plainToInstance(UserOutput, user, {
      excludeExtraneousValues: true,
    });
  }

  async update(
    userId: string,
    data: UpdateUserInput,
  ): Promise<UserOutput> {
    // 1. Business Rule Validation (Direct Prisma Access)
    await this.userModificationRule.validate(userId);

    // 2. Update Data
    const user = await this.userDatasource.update(userId, data);
    
    // 3. Emit Event (Side Effect)
    this.eventEmitter.emit(
      'user.updated',
      new UserUpdatedEvent(userId, data),
    );

    return plainToInstance(UserOutput, user, {
      excludeExtraneousValues: true,
    });
  }
}
