/*
  Warnings:

  - Made the column `userId` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_userId_fkey";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "attendingId" TEXT,
ADD COLUMN     "interestedId" TEXT,
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "attendingId" TEXT,
ADD COLUMN     "interestedId" TEXT;

-- CreateTable
CREATE TABLE "Attending" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Attending_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interested" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Interested_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_attendingId_fkey" FOREIGN KEY ("attendingId") REFERENCES "Attending"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_interestedId_fkey" FOREIGN KEY ("interestedId") REFERENCES "Interested"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_attendingId_fkey" FOREIGN KEY ("attendingId") REFERENCES "Attending"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_interestedId_fkey" FOREIGN KEY ("interestedId") REFERENCES "Interested"("id") ON DELETE SET NULL ON UPDATE CASCADE;
