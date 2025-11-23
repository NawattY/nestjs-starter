import { UserEntity } from '../entities/user.entity';

export const USER_DATASOURCE = 'UserDataSource';

export interface UserDatasourceInterface {
  findById(id: string): Promise<UserEntity | null>;
  update(
    id: string,
    data: { email?: string; firstName?: string; lastName?: string },
  ): Promise<UserEntity>;
}
