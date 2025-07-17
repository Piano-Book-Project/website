import { z } from 'zod';
import prisma from '../prisma';
import { router, procedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const userRouter = router({
  create: procedure
    .input(
      z.object({
        username: z.string().min(3),
        password: z.string().min(6),
        nickname: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const exists = await prisma.user.findUnique({ where: { username: input.username } });
        if (exists)
          throw new TRPCError({ code: 'CONFLICT', message: '이미 존재하는 아이디입니다.' });
        return await prisma.user.create({ data: input });
      } catch (e) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: (e as Error).message });
      }
    }),
  get: procedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const user = await prisma.user.findUnique({ where: { id: input.id } });
    if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: '존재하지 않는 회원입니다.' });
    return user;
  }),
  list: procedure.query(async () => {
    return prisma.user.findMany();
  }),
  update: procedure
    .input(
      z.object({
        id: z.number(),
        password: z.string().min(6).optional(),
        nickname: z.string().optional(),
        lastLoginAt: z.date().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      try {
        const user = await prisma.user.update({ where: { id }, data });
        return user;
      } catch (e) {
        throw new TRPCError({ code: 'NOT_FOUND', message: '존재하지 않는 회원입니다.' });
      }
    }),
  delete: procedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    try {
      await prisma.user.delete({ where: { id: input.id } });
      return { success: true };
    } catch (e) {
      throw new TRPCError({ code: 'NOT_FOUND', message: '존재하지 않는 회원입니다.' });
    }
  }),
});
