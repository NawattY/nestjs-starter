export class UserEntity {
  constructor(
    public id: string,
    public mobile: string | null,
    public email: string | null,
    public password: string | null,
    public fullName: string | null,
    public isActive: boolean,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}