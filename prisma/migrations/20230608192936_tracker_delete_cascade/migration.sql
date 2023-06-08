-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TrackerSyncDatapoint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" REAL NOT NULL,
    "trackerId" TEXT NOT NULL,
    "createdAt" INTEGER NOT NULL,
    CONSTRAINT "TrackerSyncDatapoint_trackerId_fkey" FOREIGN KEY ("trackerId") REFERENCES "Tracker" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TrackerSyncDatapoint" ("createdAt", "id", "trackerId", "value") SELECT "createdAt", "id", "trackerId", "value" FROM "TrackerSyncDatapoint";
DROP TABLE "TrackerSyncDatapoint";
ALTER TABLE "new_TrackerSyncDatapoint" RENAME TO "TrackerSyncDatapoint";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
