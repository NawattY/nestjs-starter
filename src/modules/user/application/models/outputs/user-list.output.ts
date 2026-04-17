import { Expose, Type } from 'class-transformer';

import { PaginatedOutput } from '@app/shared/models/paginate.output';

import { UserOutput } from './user.output';

export class UserListOutput extends PaginatedOutput<UserOutput> {
  @Expose()
  @Type(() => UserOutput)
  readonly items!: UserOutput[];
}