/*
  Warnings:

  - Added the required column `description` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EducationDegree" AS ENUM ('bachelor', 'master');

-- CreateEnum
CREATE TYPE "LanguageLevel" AS ENUM ('elementary', 'pre_intermediate', 'intermediate', 'upper_intermediate', 'advanced');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "description" VARCHAR(500) NOT NULL,
ADD COLUMN     "fullName" VARCHAR(50) NOT NULL;

-- CreateTable
CREATE TABLE "experience" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "company" VARCHAR(100) NOT NULL,
    "position" VARCHAR(30) NOT NULL,
    "description" VARCHAR(300) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "skills" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "education" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "degree" "EducationDegree" NOT NULL DEFAULT 'bachelor',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projecct" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projecct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "language" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "level" "LanguageLevel" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "language_user_relation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "language_user_relation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "experience_company_idx" ON "experience"("company");

-- CreateIndex
CREATE INDEX "experience_position_idx" ON "experience"("position");

-- CreateIndex
CREATE INDEX "education_title_idx" ON "education"("title");

-- CreateIndex
CREATE INDEX "language_name_idx" ON "language"("name");

-- CreateIndex
CREATE INDEX "language_user_relation_userId_languageId_idx" ON "language_user_relation"("userId", "languageId");

-- CreateIndex
CREATE INDEX "media_url_idx" ON "media"("url");

-- CreateIndex
CREATE INDEX "media_fileName_idx" ON "media"("fileName");

-- AddForeignKey
ALTER TABLE "experience" ADD CONSTRAINT "experience_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "education" ADD CONSTRAINT "education_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projecct" ADD CONSTRAINT "projecct_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "language_user_relation" ADD CONSTRAINT "language_user_relation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "language_user_relation" ADD CONSTRAINT "language_user_relation_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
