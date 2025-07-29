import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../server/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';

    const where = activeOnly ? { isActive: true } : {};

    const mainVisuals = await prisma.mainVisual.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        artist: {
          select: {
            id: true,
            name: true,
          },
        },
        song: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json({
      success: true,
      data: mainVisuals,
    });
  } catch (error) {
    console.error('Error fetching main visuals:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch main visuals' },
      { status: 500 },
    );
  }
}
