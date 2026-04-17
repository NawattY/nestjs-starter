export class SessionEntity {
  constructor(
    public id: string,
    public userId: string,
    public refreshTokenHash: string,
    public expiresAt: Date,
    public revokedAt: Date | null,
    public replacedAt: Date | null,
    public userAgent: string | null,
    public ipAddress: string | null,
  ) {}

  isActive(): boolean {
    return !this.revokedAt && !this.replacedAt && this.expiresAt > new Date();
  }
}