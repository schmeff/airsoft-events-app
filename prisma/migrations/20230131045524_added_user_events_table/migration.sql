/*
  Warnings:

  - You are about to drop the `Attending` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Interested` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserEventStatus" AS ENUM ('NOT_GOING', 'GOING', 'INTERESTED');

-- DropForeignKey
ALTER TABLE "Attending" DROP CONSTRAINT "Attending_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Attending" DROP CONSTRAINT "Attending_userId_fkey";

-- DropForeignKey
ALTER TABLE "Interested" DROP CONSTRAINT "Interested_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Interested" DROP CONSTRAINT "Interested_userId_fkey";

-- DropTable
DROP TABLE "Attending";

-- DropTable
DROP TABLE "Interested";

-- CreateTable
CREATE TABLE "UserEvents" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "eventId" TEXT,
    "status" "UserEventStatus" NOT NULL,

    CONSTRAINT "UserEvents_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserEvents" ADD CONSTRAINT "UserEvents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEvents" ADD CONSTRAINT "UserEvents_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
