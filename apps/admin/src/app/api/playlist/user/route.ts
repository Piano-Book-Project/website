import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId, artistId, songId } = await request.json();

    if (!userId || !artistId || !songId) {
      return NextResponse.json(
        { success: false, error: '필수 필드가 누락되었습니다.' },
        { status: 400 },
      );
    }

    const playlist = await prisma.playlist.create({
      data: {
        userId,
        artistId,
        songId,
      },
      include: {
        song: {
          include: {
            artist: true,
            tags: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: playlist,
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
    console.error('Error creating playlist:', error);
    return NextResponse.json(
      { success: false, error: '플레이리스트 생성 중 오류가 발생했습니다.' },
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
