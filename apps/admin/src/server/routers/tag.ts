import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import prisma from '../prisma';
import { router, procedure } from '../trpc';

export const tagRouter = router({
  create: procedure
    .input(
      z.object({
        name: z.string().min(1),
        createdBy: z.string(),
        isActive: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        return await prisma.tag.create({ data: { ...input, updatedBy: input.createdBy } });
      } catch (e) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: (e as Error).message });
      }
    }),
  update: procedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        updatedBy: z.string(),
        isActive: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const { id, ...data } = input;
        return await prisma.tag.update({ where: { id }, data });
      } catch (e) {
        throw new TRPCError({ code: 'NOT_FOUND', message: '존재하지 않는 태그입니다.' });
      }
    }),
  delete: procedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    try {
      await prisma.tag.delete({ where: { id: input.id } });
      return { success: true };
    } catch (e) {
      throw new TRPCError({ code: 'NOT_FOUND', message: '존재하지 않는 태그입니다.' });
    }
  }),
  get: procedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const tag = await prisma.tag.findUnique({
      where: { id: input.id },
      include: { songs: true },
    });
    if (!tag) throw new TRPCError({ code: 'NOT_FOUND', message: '존재하지 않는 태그입니다.' });
    return tag;
  }),
  list: procedure
    .input(z.object({ isActive: z.boolean().optional() }).optional())
    .query(async ({ input }) => {
      return prisma.tag.findMany({
        where: { isActive: input?.isActive },
        include: { songs: true },
      });
    }),
});
