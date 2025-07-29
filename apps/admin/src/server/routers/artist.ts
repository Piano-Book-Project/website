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
        categoryId: z.number(),
        createdBy: z.string(),
        isActive: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        console.log('Artist create input:', input);
        const result = await prisma.artist.create({
          data: { ...input, updatedBy: input.createdBy },
        });
        console.log('Artist created successfully:', result);
        return result;
      } catch (e) {
        console.error('Artist creation error:', e);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: (e as Error).message });
      }
    }),
  update: procedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        categoryId: z.number().optional(),
        updatedBy: z.string(),
        isActive: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const { id, ...data } = input;
        return await prisma.artist.update({ where: { id }, data });
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
  get: procedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const artist = await prisma.artist.findUnique({
      where: { id: input.id },
      include: { songs: true },
    });
    if (!artist)
      throw new TRPCError({ code: 'NOT_FOUND', message: '존재하지 않는 아티스트입니다.' });
    return artist;
  }),
  list: procedure
    .input(z.object({ isActive: z.boolean().optional() }).optional())
    .query(async ({ input }) => {
      return prisma.artist.findMany({
        where: { isActive: input?.isActive },
        include: { songs: true },
      });
    }),
});
