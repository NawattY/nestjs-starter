export class UserAuthEntity {
  constructor(
    public userId: string,
    public mobile: string | null,
    public email: string | null,
    public password: string | null,
    public displayName: string | null,
    public lineUserId: string | null,
    public hasPassword: boolean,
  ) {}
}

