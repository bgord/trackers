-- CreateTable
CREATE TABLE "History" (
    "createdAt" INTEGER NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "relatedTrackerId" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "payload" TEXT
);
