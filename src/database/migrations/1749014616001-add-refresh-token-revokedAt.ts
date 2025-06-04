import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRefreshTokenRevokedAt1749014616001
  implements MigrationInterface
{
  name = 'AddRefreshTokenRevokedAt1749014616001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD "revokedAt" TIMESTAMP WITH TIME ZONE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP COLUMN "revokedAt"`,
    );
  }
}
