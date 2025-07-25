-- 1. Category 테이블 생성
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "name" TEXT NOT NULL UNIQUE
);

-- 2. Artist 테이블에 categoryId 컬럼 추가 (NOT NULL, 임시 기본값 1)
ALTER TABLE "Artist" ADD COLUMN "categoryId" INTEGER NOT NULL DEFAULT 1;

-- 3. 외래키 연결 (SQLite는 직접 테이블 재생성 필요)
PRAGMA foreign_keys=off;
CREATE TABLE "new_Artist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "categoryId" INTEGER NOT NULL,
    CONSTRAINT "Artist_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Artist" ("id", "name", "description", "imageUrl", "categoryId") SELECT "id", "name", "description", "imageUrl", "categoryId" FROM "Artist";
DROP TABLE "Artist";
ALTER TABLE "new_Artist" RENAME TO "Artist";
PRAGMA foreign_keys=on;
