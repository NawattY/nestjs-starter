import { Expose } from 'class-transformer';

export class UserOutput {
  @Expose()
  id!: string;

  @Expose()
  email?: string;

  @Expose()
  mobile!: string;

  @Expose()
  fullName!: string;

  @Expose()
  isActive!: boolean;
}
