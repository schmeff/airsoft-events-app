-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(75) NOT NULL,
    "description" VARCHAR NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "entryFee" MONEY NOT NULL,
    "location" VARCHAR NOT NULL,
    "locationLink" VARCHAR NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);
