import { Expose, Type } from 'class-transformer';
import { PaginatedOutput } from '#shared/models/paginate.output';
import { UserOutput } from './user.output';

export class UserListOutput extends PaginatedOutput<UserOutput> {
  @Expose()
  @Type(() => UserOutput)
  items!: UserOutput[];
}
