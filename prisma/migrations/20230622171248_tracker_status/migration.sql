-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tracker" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kind" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" INTEGER NOT NULL,
    "updatedAt" INTEGER NOT NULL
);
INSERT INTO "new_Tracker" ("createdAt", "id", "kind", "name", "updatedAt", "value") SELECT "createdAt", "id", "kind", "name", "updatedAt", "value" FROM "Tracker";
DROP TABLE "Tracker";
ALTER TABLE "new_Tracker" RENAME TO "Tracker";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
