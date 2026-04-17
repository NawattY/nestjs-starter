import { Expose } from 'class-transformer';

export class UserOutput {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly email?: string;

  @Expose()
  readonly mobile!: string;

  @Expose()
  readonly fullName!: string;

  @Expose()
  readonly isActive!: boolean;
}
