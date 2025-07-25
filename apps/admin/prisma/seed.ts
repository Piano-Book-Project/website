import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.admin.upsert({
    where: { username: 'sysadmin' },
    update: {},
    create: {
      username: 'sysadmin',
      password: 'sysadmin1234!',
      nickname: '백살이',
    },
  });

  // --- 샘플 카테고리/가수/노래 데이터 ---
  // 1. 카테고리 생성
  const jpop = await prisma.category.upsert({
    where: { name: 'J-POP' },
    update: {
      status: 'active',
      code: 'CT-0001',
      order: 1,
      createdBy: 'sysadmin',
      updatedBy: 'sysadmin',
    },
    create: {
      name: 'J-POP',
      status: 'active',
      code: 'CT-0001',
      order: 1,
      createdBy: 'sysadmin',
      updatedBy: 'sysadmin',
    },
  });
  const kpop = await prisma.category.upsert({
    where: { name: 'K-POP' },
    update: {
      status: 'active',
      code: 'CT-0002',
      order: 2,
      createdBy: 'sysadmin',
      updatedBy: 'sysadmin',
    },
    create: {
      name: 'K-POP',
      status: 'active',
      code: 'CT-0002',
      order: 2,
      createdBy: 'sysadmin',
      updatedBy: 'sysadmin',
    },
  });

  // 2. J-POP 가수/노래
  await prisma.artist.upsert({
    where: { name: 'YOASOBI' },
    update: {},
    create: {
      name: 'YOASOBI',
      description: '일본의 인기 듀오',
      imageUrl: 'https://i.ytimg.com/vi/3eytpBOkFqY/hqdefault.jpg',
      categoryId: jpop.id,
      songs: {
        create: [
          {
            title: '夜に駆ける',
            description: 'YOASOBI 대표곡',
            imageUrl: 'https://i.ytimg.com/vi/x8VYWazR5mE/hqdefault.jpg',
            youtubeUrl: 'https://www.youtube.com/watch?v=x8VYWazR5mE',
            hasImage: true,
          },
        ],
      },
    },
    include: { songs: true },
  });

  // 3. K-POP 가수/노래
  await prisma.artist.upsert({
    where: { name: 'NewJeans' },
    update: {},
    create: {
      name: 'NewJeans',
      description: '대한민국의 걸그룹',
      imageUrl: 'https://i.ytimg.com/vi/ArmDp-zijuc/hqdefault.jpg',
      categoryId: kpop.id,
      songs: {
        create: [
          {
            title: 'Super Shy',
            description: 'NewJeans 대표곡',
            imageUrl: 'https://i.ytimg.com/vi/ArmDp-zijuc/hqdefault.jpg',
            youtubeUrl: 'https://www.youtube.com/watch?v=ArmDp-zijuc',
            hasImage: true,
          },
        ],
      },
    },
    include: { songs: true },
  });

  // 4. K-POP 추가 곡 (예시: Hebi. - 늘(Ever))
  const hebi = await prisma.artist.upsert({
    where: { name: 'Hebi.' },
    update: {},
    create: {
      name: 'Hebi.',
      description: '감성 싱어송라이터',
      imageUrl: 'https://i.ytimg.com/vi/3eytpBOkFqY/hqdefault.jpg',
      categoryId: kpop.id,
      songs: {
        create: [
          {
            title: '늘(Ever)',
            description: 'Hebi. 대표곡',
            imageUrl: 'https://i.ytimg.com/vi/3eytpBOkFqY/hqdefault.jpg',
            youtubeUrl: 'https://www.youtube.com/watch?v=3eytpBOkFqY',
            hasImage: true,
            isFeaturedMainVisual: true,
          },
        ],
      },
    },
    include: { songs: true },
  });

  // 5. Hebi. 곡을 플레이리스트에 자동 추가 (userId=1)
  const user = await prisma.user.upsert({
    where: { username: 'test01' },
    update: {},
    create: {
      username: 'test01',
      password: 'testpw',
      nickname: '테스트유저',
    },
  });
  const hebiSong = hebi.songs[0];
  await prisma.playlist.create({
    data: {
      userId: user.id,
      artistId: hebi.id,
      songId: hebiSong.id,
      isFavorite: false,
    },
  });
}

main()
  .catch(() => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
