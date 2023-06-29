/*
  Warnings:

  - You are about to drop the `TrackerDatapoint` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TrackerDatapoint";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Datapoint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" REAL NOT NULL,
    "comment" TEXT,
    "trackerId" TEXT NOT NULL,
    "createdAt" INTEGER NOT NULL,
    CONSTRAINT "Datapoint_trackerId_fkey" FOREIGN KEY ("trackerId") REFERENCES "Tracker" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
