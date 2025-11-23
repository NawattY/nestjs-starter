import { UserEntity } from '../entities/user.entity';
import { FindUsersInput } from '../models/find-users.input';
import { PaginatedResultInterface } from '#shared/interfaces/paginated-result.interface';

export const USER_DATASOURCE = 'UserDataSource';

export interface UserDatasourceInterface {
  findById(id: string): Promise<UserEntity | null>;
  findAll(input: FindUsersInput): Promise<PaginatedResultInterface<UserEntity>>;
  update(
    id: string,
    data: { email?: string; firstName?: string; lastName?: string },
  ): Promise<UserEntity>;
}
