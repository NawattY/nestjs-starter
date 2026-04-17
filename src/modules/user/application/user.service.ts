import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { plainToInstance } from 'class-transformer';

import { UserUpdatedEvent } from '../events/user-updated.event';
import { USER_DATASOURCE, UserDatasourceInterface } from '../infrastructure/datasources/user.datasource.interface';
import { FindUsersInput } from './models/inputs/find-users.input';
import { UpdateUserInput } from './models/inputs/update-user.input';
import { UserListOutput } from './models/outputs/user-list.output';
import { UserOutput } from './models/outputs/user.output';
import { UserModificationRule } from './rules/user-modification.rule';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_DATASOURCE)
    private readonly userDatasource: UserDatasourceInterface,
    private readonly userModificationRule: UserModificationRule,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findAll(input: FindUsersInput): Promise<UserListOutput> {
    const result = await this.userDatasource.findAll(input);

    return plainToInstance(UserListOutput, {
      items: plainToInstance(UserOutput, result.items, {
        excludeExtraneousValues: true,
      }),
      meta: result.meta,
      links: result.links,
    });
  }

  async getById(userId: string): Promise<UserOutput | null> {
    const user = await this.userDatasource.findById(userId);
    if (!user) return null;

    return plainToInstance(UserOutput, user, {
      excludeExtraneousValues: true,
    });
  }

  async update(input: UpdateUserInput): Promise<UserOutput> {
    await this.userModificationRule.validate(input.userId);

    const { userId, ...data } = input;
    const user = await this.userDatasource.update(userId, data);

    this.eventEmitter.emit(
      'user.updated',
      new UserUpdatedEvent(userId, data),
    );

    return plainToInstance(UserOutput, user, {
      excludeExtraneousValues: true,
    });
  }
}