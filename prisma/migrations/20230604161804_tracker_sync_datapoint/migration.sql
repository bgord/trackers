-- CreateTable
CREATE TABLE "TrackerSyncDatapoint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" REAL NOT NULL,
    "trackerId" TEXT NOT NULL,
    "createdAt" INTEGER NOT NULL,
    CONSTRAINT "TrackerSyncDatapoint_trackerId_fkey" FOREIGN KEY ("trackerId") REFERENCES "Tracker" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
