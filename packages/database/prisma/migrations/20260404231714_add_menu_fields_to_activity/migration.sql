-- AlterTable
ALTER TABLE "activities" ADD COLUMN     "menuConfig" JSONB,
ADD COLUMN     "menuOrder" INTEGER,
ADD COLUMN     "showInMenu" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "slides" ALTER COLUMN "name" SET DATA TYPE TEXT;
