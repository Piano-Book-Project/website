import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import prisma from '../prisma';
import { router, procedure } from '../trpc';

export const permissionRouter = router({
  create: procedure
    .input(
      z.object({
        adminId: z.number(),
        canEditPost: z.boolean().optional(),
        canDeletePost: z.boolean().optional(),
        canAddPost: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        return await prisma.permission.create({ data: input });
      } catch (e) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: (e as Error).message });
      }
    }),
  get: procedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const permission = await prisma.permission.findUnique({ where: { id: input.id } });
    if (!permission)
      throw new TRPCError({ code: 'NOT_FOUND', message: '존재하지 않는 권한입니다.' });
    return permission;
  }),
  list: procedure.query(async () => {
    return prisma.permission.findMany();
  }),
  update: procedure
    .input(
      z.object({
        id: z.number(),
        canEditPost: z.boolean().optional(),
        canDeletePost: z.boolean().optional(),
        canAddPost: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      try {
        const permission = await prisma.permission.update({ where: { id }, data });
        return permission;
      } catch (e) {
        throw new TRPCError({ code: 'NOT_FOUND', message: '존재하지 않는 권한입니다.' });
      }
    }),
  delete: procedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    try {
      await prisma.permission.delete({ where: { id: input.id } });
      return { success: true };
    } catch (e) {
      throw new TRPCError({ code: 'NOT_FOUND', message: '존재하지 않는 권한입니다.' });
    }
  }),
});
