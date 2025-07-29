-- CreateTable
CREATE TABLE "MainVisual" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "artistId" INTEGER NOT NULL,
    "songId" INTEGER NOT NULL,
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
    CONSTRAINT "MainVisual_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MainVisual_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "MainVisual_code_key" ON "MainVisual"("code");
