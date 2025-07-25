import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import prisma from '../prisma';
import { router, procedure } from '../trpc';

export const playlistRouter = router({
  create: procedure
    .input(
      z.object({
        userId: z.number(),
        artistId: z.number(),
        songId: z.number(),
        isFavorite: z.boolean().optional(),
        playedAt: z.date().optional(),
        createdBy: z.string(),
        isActive: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        return await prisma.playlist.create({ data: input });
      } catch (e) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: (e as Error).message });
      }
    }),
  update: procedure
    .input(
      z.object({
        id: z.number(),
        isFavorite: z.boolean().optional(),
        playedAt: z.date().optional(),
        updatedBy: z.string(),
        isActive: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const { id, ...data } = input;
        return await prisma.playlist.update({ where: { id }, data });
      } catch (e) {
        throw new TRPCError({ code: 'NOT_FOUND', message: '존재하지 않는 플레이리스트입니다.' });
      }
    }),
  delete: procedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    try {
      await prisma.playlist.delete({ where: { id: input.id } });
      return { success: true };
    } catch (e) {
      throw new TRPCError({ code: 'NOT_FOUND', message: '존재하지 않는 플레이리스트입니다.' });
    }
  }),
  get: procedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const playlist = await prisma.playlist.findUnique({
      where: { id: input.id },
      include: { song: { include: { artist: true, tags: true } } },
    });
    if (!playlist)
      throw new TRPCError({ code: 'NOT_FOUND', message: '존재하지 않는 플레이리스트입니다.' });
    return playlist;
  }),
  list: procedure
    .input(z.object({ userId: z.number().optional(), isActive: z.boolean().optional() }).optional())
    .query(async ({ input }) => {
      return prisma.playlist.findMany({
        where: { userId: input?.userId },
        include: { song: { include: { artist: true, tags: true } } },
      });
    }),
});
