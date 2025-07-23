import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import prisma from '../prisma';
import { router, procedure } from '../trpc';
import type { NextApiRequest, NextApiResponse } from 'next';

export const songRouter = router({
  create: procedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        youtubeUrl: z.string().optional(),
        hasImage: z.boolean().optional(),
        hasAttachment: z.boolean().optional(),
        pdfUrl: z.string().optional(),
        artistId: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        return await prisma.song.create({ data: input });
      } catch (e) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: (e as Error).message });
      }
    }),
  get: procedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const song = await prisma.song.findUnique({
      where: { id: input.id },
      include: { artist: true, playlists: true },
    });
    if (!song) throw new TRPCError({ code: 'NOT_FOUND', message: '존재하지 않는 노래입니다.' });
    return song;
  }),
  list: procedure.query(async () => {
    return prisma.song.findMany({ include: { artist: true, playlists: true } });
  }),
  update: procedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        youtubeUrl: z.string().optional(),
        hasImage: z.boolean().optional(),
        hasAttachment: z.boolean().optional(),
        pdfUrl: z.string().optional(),
        artistId: z.number().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      try {
        const song = await prisma.song.update({ where: { id }, data });
        return song;
      } catch (e) {
        throw new TRPCError({ code: 'NOT_FOUND', message: '존재하지 않는 노래입니다.' });
      }
    }),
  delete: procedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    try {
      await prisma.song.delete({ where: { id: input.id } });
      return { success: true };
    } catch (e) {
      throw new TRPCError({ code: 'NOT_FOUND', message: '존재하지 않는 노래입니다.' });
    }
  }),
});

// 임시: id=1 노래의 imageUrl을 업데이트하는 API (실행 후 반드시 삭제)
export async function updateSongImageUrl(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const updated = await prisma.song.update({
      where: { id: 1 },
      data: {
        imageUrl: 'https://i.namu.wiki/i/O9vf0iStTwTT7k81mQqdSqtGc7gdXdmlDuFU1mVtQE-296jGux-GgNqP74FxWTnGrr4BUw0jdE5muGuwlNiHGQ.webp',
      },
    });
    res.status(200).json({ success: true, updated });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
}
