import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import prisma from '../prisma';
import { router, procedure } from '../trpc';

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
