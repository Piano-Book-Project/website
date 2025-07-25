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
        tagIds: z.array(z.number()).optional(),
        createdBy: z.string(),
        isActive: z.boolean().optional(),
        isFeaturedMainVisual: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const { tagIds, ...songData } = input;
        const song = await prisma.song.create({
          data: {
            ...songData,
            updatedBy: songData.createdBy,
            tags: tagIds ? { connect: tagIds.map((id) => ({ id })) } : undefined,
          },
          include: { tags: true, artist: true },
        });
        return song;
      } catch (e) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: (e as Error).message });
      }
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
        tagIds: z.array(z.number()).optional(),
        updatedBy: z.string(),
        isActive: z.boolean().optional(),
        isFeaturedMainVisual: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const { id, tagIds, ...songData } = input;
        const song = await prisma.song.update({
          where: { id },
          data: {
            ...songData,
            tags: tagIds ? { set: tagIds.map((id) => ({ id })) } : undefined,
          },
          include: { tags: true, artist: true },
        });
        return song;
      } catch (e) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: (e as Error).message });
      }
    }),
  delete: procedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    try {
      await prisma.song.delete({ where: { id: input.id } });
      return { success: true };
    } catch (e) {
      throw new TRPCError({ code: 'NOT_FOUND', message: '존재하지 않는 곡입니다.' });
    }
  }),
  get: procedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const song = await prisma.song.findUnique({
      where: { id: input.id },
      include: { artist: true, tags: true },
    });
    if (!song) throw new TRPCError({ code: 'NOT_FOUND', message: '존재하지 않는 곡입니다.' });
    return song;
  }),
  list: procedure
    .input(z.object({ isActive: z.boolean().optional() }).optional())
    .query(async ({ input }) => {
      return prisma.song.findMany({
        where: { isActive: input?.isActive },
        include: { artist: true, tags: true },
      });
    }),
});
