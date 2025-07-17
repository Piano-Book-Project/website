import { z } from 'zod';
import prisma from '../prisma';
import { router, procedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const menuAccessRouter = router({
  create: procedure
    .input(
      z.object({
        adminId: z.number(),
        menuName: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        return await prisma.menuAccess.create({ data: input });
      } catch (e) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: (e as Error).message });
      }
    }),
  get: procedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const menuAccess = await prisma.menuAccess.findUnique({ where: { id: input.id } });
    if (!menuAccess)
      throw new TRPCError({ code: 'NOT_FOUND', message: '존재하지 않는 메뉴 접근 권한입니다.' });
    return menuAccess;
  }),
  list: procedure.query(async () => {
    return prisma.menuAccess.findMany();
  }),
  update: procedure
    .input(
      z.object({
        id: z.number(),
        menuName: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      try {
        const menuAccess = await prisma.menuAccess.update({ where: { id }, data });
        return menuAccess;
      } catch (e) {
        throw new TRPCError({ code: 'NOT_FOUND', message: '존재하지 않는 메뉴 접근 권한입니다.' });
      }
    }),
  delete: procedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    try {
      await prisma.menuAccess.delete({ where: { id: input.id } });
      return { success: true };
    } catch (e) {
      throw new TRPCError({ code: 'NOT_FOUND', message: '존재하지 않는 메뉴 접근 권한입니다.' });
    }
  }),
});
