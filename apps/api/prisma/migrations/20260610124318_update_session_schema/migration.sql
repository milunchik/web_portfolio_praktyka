-- AlterTable
ALTER TABLE "session" ALTER COLUMN "accessTokenExpiresAt" DROP NOT NULL,
ALTER COLUMN "refreshTokenExpiresAt" DROP NOT NULL;
