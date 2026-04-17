import { PaginatedResultInterface } from '@app/shared/interfaces/paginated-result.interface';

import { FindUsersInput } from '../../application/models/inputs/find-users.input';
import { UserEntity } from '../../domain/entities/user.entity';

export const USER_DATASOURCE = 'UserDataSource';

export interface UserDatasourceInterface {
  findById(id: string): Promise<UserEntity | null>;
  findAll(input: FindUsersInput): Promise<PaginatedResultInterface<UserEntity>>;
  update(
    id: string,
    data: { email?: string; firstName?: string; lastName?: string },
  ): Promise<UserEntity>;
}