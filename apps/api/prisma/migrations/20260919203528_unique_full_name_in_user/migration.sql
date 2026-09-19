/*
  Warnings:

  - A unique constraint covering the columns `[fullName]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_fullName_key" ON "user"("fullName");
