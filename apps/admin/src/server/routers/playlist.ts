import { z } from 'zod';
import prisma from '../prisma';
import { router, procedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const playlistRouter = router({
  create: procedure
    .input(
      z.object({
        userId: z.number(),
        artistId: z.number(),
        songId: z.number(),
        isFavorite: z.boolean().optional(),
        playedAt: z.date().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        return await prisma.playlist.create({ data: input });
      } catch (e) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: (e as Error).message });
      }
    }),
  get: procedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const playlist = await prisma.playlist.findUnique({ where: { id: input.id } });
    if (!playlist)
      throw new TRPCError({ code: 'NOT_FOUND', message: '존재하지 않는 플레이리스트입니다.' });
    return playlist;
  }),
  list: procedure.query(async () => {
    return prisma.playlist.findMany();
  }),
  update: procedure
    .input(
      z.object({
        id: z.number(),
        isFavorite: z.boolean().optional(),
        playedAt: z.date().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      try {
        const playlist = await prisma.playlist.update({ where: { id }, data });
        return playlist;
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
});
