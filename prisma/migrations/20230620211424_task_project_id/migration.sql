/*
  Warnings:

  - Added the required column `projectId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" INTEGER NOT NULL,
    "updatedAt" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "projectId" TEXT NOT NULL,
    CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("createdAt", "id", "name", "status", "updatedAt") SELECT "createdAt", "id", "name", "status", "updatedAt" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
CREATE TABLE "new_TrackerDatapoint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" REAL NOT NULL,
    "trackerId" TEXT NOT NULL,
    "createdAt" INTEGER NOT NULL,
    "projectId" TEXT,
    CONSTRAINT "TrackerDatapoint_trackerId_fkey" FOREIGN KEY ("trackerId") REFERENCES "Tracker" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TrackerDatapoint_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_TrackerDatapoint" ("createdAt", "id", "trackerId", "value") SELECT "createdAt", "id", "trackerId", "value" FROM "TrackerDatapoint";
DROP TABLE "TrackerDatapoint";
ALTER TABLE "new_TrackerDatapoint" RENAME TO "TrackerDatapoint";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
