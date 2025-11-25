/*
  Warnings:

  - The `status` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "status",
ADD COLUMN     "status" VARCHAR(20) NOT NULL DEFAULT 'active';

-- DropEnum
DROP TYPE "CommonStatus";

-- CreateIndex
CREATE INDEX "user_status_idx" ON "user"("status");
