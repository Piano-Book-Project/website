-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MainVisual" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "artistId" INTEGER,
    "songId" INTEGER,
    "displayType" TEXT NOT NULL,
    "imageUrl" TEXT,
    "youtubeUrl" TEXT,
    "streamingUrl" TEXT,
    "isLive" BOOLEAN NOT NULL DEFAULT false,
    "liveStatus" TEXT NOT NULL DEFAULT 'offline',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "MainVisual_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MainVisual_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "MainVisual_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_MainVisual" ("artistId", "categoryId", "code", "createdAt", "createdBy", "displayType", "id", "imageUrl", "isActive", "isLive", "liveStatus", "order", "songId", "streamingUrl", "updatedAt", "updatedBy", "youtubeUrl") SELECT "artistId", "categoryId", "code", "createdAt", "createdBy", "displayType", "id", "imageUrl", "isActive", "isLive", "liveStatus", "order", "songId", "streamingUrl", "updatedAt", "updatedBy", "youtubeUrl" FROM "MainVisual";
DROP TABLE "MainVisual";
ALTER TABLE "new_MainVisual" RENAME TO "MainVisual";
CREATE UNIQUE INDEX "MainVisual_code_key" ON "MainVisual"("code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
