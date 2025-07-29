import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { artistName, songName } = await request.json();

    if (!artistName || !songName) {
      return NextResponse.json(
        { success: false, error: '아티스트명과 곡명이 필요합니다.' },
        { status: 400 },
      );
    }

    // 아티스트와 곡 정보 조회
    const song = await prisma.song.findFirst({
      where: {
        title: songName,
        artist: {
          name: artistName,
        },
      },
      include: {
        artist: {
          include: {
            category: true,
          },
        },
        tags: true,
      },
    });

    if (!song) {
      return NextResponse.json(
        { success: false, error: '해당 곡을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          songId: song.id,
          artistId: song.artist.id,
          song: {
            id: song.id,
            title: song.title,
            description: song.description,
            imageUrl: song.imageUrl,
            youtubeUrl: song.youtubeUrl,
            hasImage: song.hasImage,
            hasAttachment: song.hasAttachment,
            pdfUrl: song.pdfUrl,
            artistId: song.artistId,
            createdAt: song.createdAt,
            createdBy: song.createdBy,
            updatedAt: song.updatedAt,
            updatedBy: song.updatedBy,
            isActive: song.isActive,
            isFeaturedMainVisual: song.isFeaturedMainVisual,
            tags: song.tags,
          },
          artist: {
            id: song.artist.id,
            name: song.artist.name,
            description: song.artist.description,
            imageUrl: song.artist.imageUrl,
            categoryId: song.artist.categoryId,
            createdAt: song.artist.createdAt,
            createdBy: song.artist.createdBy,
            updatedAt: song.artist.updatedAt,
            updatedBy: song.artist.updatedBy,
            isActive: song.artist.isActive,
            category: song.artist.category,
          },
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
    console.error('Error searching song:', error);
    return NextResponse.json(
      { success: false, error: '곡 검색 중 오류가 발생했습니다.' },
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
