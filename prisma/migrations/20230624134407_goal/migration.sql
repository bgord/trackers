-- CreateTable
CREATE TABLE "Goal" (
    "createdAt" INTEGER NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "kind" TEXT NOT NULL,
    "relatedTrackerId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "target" REAL NOT NULL,
    "updatedAt" INTEGER NOT NULL,
    CONSTRAINT "Goal_relatedTrackerId_fkey" FOREIGN KEY ("relatedTrackerId") REFERENCES "Tracker" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
