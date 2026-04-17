export class RefreshTokenInput {
  constructor(input: { refreshToken: string; ip: string; userAgent: string }) {
    this.refreshToken = input.refreshToken;
    this.ip = input.ip;
    this.userAgent = input.userAgent;
  }

  readonly refreshToken!: string;
  readonly ip!: string;
  readonly userAgent!: string;
}
