import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import prisma from '../prisma';
import { router, procedure } from '../trpc';

export const artistRouter = router({
  create: procedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        return await prisma.artist.create({ data: input });
      } catch (e) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: (e as Error).message });
      }
    }),
  get: procedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const artist = await prisma.artist.findUnique({
      where: { id: input.id },
      include: { songs: true, playlists: true },
    });
    if (!artist)
      throw new TRPCError({ code: 'NOT_FOUND', message: '존재하지 않는 아티스트입니다.' });
    return artist;
  }),
  list: procedure.query(async () => {
    return prisma.artist.findMany({ include: { songs: true, playlists: true } });
  }),
  update: procedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      try {
        const artist = await prisma.artist.update({ where: { id }, data });
        return artist;
      } catch (e) {
        throw new TRPCError({ code: 'NOT_FOUND', message: '존재하지 않는 아티스트입니다.' });
      }
    }),
  delete: procedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    try {
      await prisma.artist.delete({ where: { id: input.id } });
      return { success: true };
    } catch (e) {
      throw new TRPCError({ code: 'NOT_FOUND', message: '존재하지 않는 아티스트입니다.' });
    }
  }),
});
