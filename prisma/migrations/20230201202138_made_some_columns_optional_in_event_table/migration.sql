-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "entryFee" DROP NOT NULL,
ALTER COLUMN "entryFee" SET DEFAULT 0,
ALTER COLUMN "locationLink" DROP NOT NULL;
