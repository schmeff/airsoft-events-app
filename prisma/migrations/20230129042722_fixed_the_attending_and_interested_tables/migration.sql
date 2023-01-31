/*
  Warnings:

  - You are about to drop the column `attendingId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `interestedId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `attendingId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `interestedId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_attendingId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_interestedId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_attendingId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_interestedId_fkey";

-- AlterTable
ALTER TABLE "Attending" ADD COLUMN     "eventId" TEXT,
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "attendingId",
DROP COLUMN "interestedId";

-- AlterTable
ALTER TABLE "Interested" ADD COLUMN     "eventId" TEXT,
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "attendingId",
DROP COLUMN "interestedId";

-- AddForeignKey
ALTER TABLE "Attending" ADD CONSTRAINT "Attending_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attending" ADD CONSTRAINT "Attending_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interested" ADD CONSTRAINT "Interested_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interested" ADD CONSTRAINT "Interested_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
