-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Goal" (
    "createdAt" INTEGER NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "kind" TEXT NOT NULL,
    "relatedTrackerId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "target" REAL NOT NULL,
    "updatedAt" INTEGER NOT NULL
);
INSERT INTO "new_Goal" ("createdAt", "id", "kind", "relatedTrackerId", "status", "target", "updatedAt") SELECT "createdAt", "id", "kind", "relatedTrackerId", "status", "target", "updatedAt" FROM "Goal";
DROP TABLE "Goal";
ALTER TABLE "new_Goal" RENAME TO "Goal";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
