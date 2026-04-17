export class LoginInput {
  constructor(input: {
    mobile: string;
    password: string;
    ip: string;
    userAgent: string;
  }) {
    this.mobile = input.mobile;
    this.password = input.password;
    this.ip = input.ip;
    this.userAgent = input.userAgent;
  }

  readonly mobile!: string;
  readonly password!: string;
  readonly ip!: string;
  readonly userAgent!: string;
}