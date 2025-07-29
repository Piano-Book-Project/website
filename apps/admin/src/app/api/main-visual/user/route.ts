import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 실제 DB에서 메인 비주얼 데이터 가져오기
    const mainVisuals = await prisma.mainVisual.findMany({
      where: { isActive: true },
      include: {
        category: true,
        artist: true,
        song: true,
      },
      orderBy: { order: 'asc' },
    });

    // 카테고리별로 그룹화
    const categoryGroups = mainVisuals.reduce((acc: any, mv: any) => {
      const categoryName = mv.category.name;
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push({
        id: mv.id,
        code: mv.code,
        category: mv.category.name,
        artist: mv.artist?.name || null,
        song: mv.song?.title || null,
        artistId: mv.artist?.id || null,
        songId: mv.song?.id || null,
        displayType: mv.displayType,
        imageUrl: mv.imageUrl,
        youtubeUrl: mv.youtubeUrl,
        streamingUrl: mv.streamingUrl,
        isLive: mv.isLive,
        liveStatus: mv.liveStatus,
      });
      return acc;
    }, {});

    // 메인 비주얼이 등록된 카테고리만 추출
    const categories = Object.keys(categoryGroups);

    return NextResponse.json(
      {
        success: true,
        data: {
          categories,
          mainVisuals: categoryGroups,
        },
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      },
    );
  } catch (error) {
    console.error('Error fetching user main visual data:', error);
    return NextResponse.json(
      { success: false, error: '메인 비주얼 데이터를 가져오는 중 오류가 발생했습니다.' },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      },
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
