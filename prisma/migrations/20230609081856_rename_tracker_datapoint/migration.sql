/*
  Warnings:

  - You are about to drop the `TrackerSyncDatapoint` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TrackerSyncDatapoint";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "TrackerDatapoint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" REAL NOT NULL,
    "trackerId" TEXT NOT NULL,
    "createdAt" INTEGER NOT NULL,
    CONSTRAINT "TrackerDatapoint_trackerId_fkey" FOREIGN KEY ("trackerId") REFERENCES "Tracker" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
