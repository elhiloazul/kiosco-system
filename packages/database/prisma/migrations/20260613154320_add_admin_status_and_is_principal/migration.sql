-- CreateEnum
CREATE TYPE "AdminStatus" AS ENUM ('ENABLED', 'DISABLED');

-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "isPrincipal" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "AdminStatus" NOT NULL DEFAULT 'ENABLED';
