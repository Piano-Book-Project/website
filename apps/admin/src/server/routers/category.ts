import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import prisma from '../prisma';
import { router, procedure } from '../trpc';

export const categoryRouter = router({
  // 카테고리 생성: order, code 자동 부여
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
        // 현재 카테고리 개수 및 마지막 order/code 조회
        const categories = await prisma.category.findMany({ orderBy: { order: 'asc' } });
        const nextOrder =
          categories.length > 0
            ? (categories[categories.length - 1].order ?? categories.length) + 1
            : 1;
        const nextCode = `CT-${String(nextOrder).padStart(3, '0')}`;
        const category = await prisma.category.create({
          data: {
            name: input.name,
            order: nextOrder,
            code: nextCode,
            createdBy: input.createdBy,
            updatedBy: input.createdBy,
            isActive: input.isActive ?? true,
          },
        });
        return category;
      } catch (e) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: (e as Error).message });
      }
    }),
  update: procedure
    .input(
      z.object({
        id: z.number(),
        code: z.string().optional(),
        name: z.string().optional(),
        order: z.number().optional(),
        updatedBy: z.string(),
        isActive: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const { id, ...data } = input;
        return await prisma.category.update({ where: { id }, data });
      } catch (e) {
        throw new TRPCError({ code: 'NOT_FOUND', message: '존재하지 않는 카테고리입니다.' });
      }
    }),
  updateOrder: procedure
    .input(z.object({ orders: z.array(z.object({ id: z.number(), order: z.number() })) }))
    .mutation(async ({ input }) => {
      try {
        // 트랜잭션으로 일괄 업데이트
        await prisma.$transaction(
          input.orders.map(({ id, order }) =>
            prisma.category.update({ where: { id }, data: { order } }),
          ),
        );
        return { success: true };
      } catch (e) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: (e as Error).message });
      }
    }),
  // 카테고리 삭제: order, code 재정렬
  delete: procedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    try {
      await prisma.category.delete({ where: { id: input.id } });
      // 남은 카테고리 재정렬
      const categories = await prisma.category.findMany({ orderBy: { order: 'asc' } });
      await Promise.all(
        categories.map((cat: any, idx: number) =>
          prisma.category.update({
            where: { id: cat.id },
            data: {
              order: idx + 1,
              code: `CT-${String(idx + 1).padStart(3, '0')}`,
            },
          }),
        ),
      );
      return { success: true };
    } catch (e) {
      throw new TRPCError({ code: 'NOT_FOUND', message: '존재하지 않는 카테고리입니다.' });
    }
  }),
  get: procedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const category = await prisma.category.findUnique({
      where: { id: input.id },
      include: { artists: true },
    });
    if (!category)
      throw new TRPCError({ code: 'NOT_FOUND', message: '존재하지 않는 카테고리입니다.' });
    return category;
  }),
  // 카테고리 리스트: songCount 포함
  list: procedure
    .input(z.object({ isActive: z.boolean().optional() }).optional())
    .query(async ({ input }) => {
      const categories = await prisma.category.findMany({
        where: { isActive: input?.isActive },
        orderBy: { order: 'asc' },
        include: { artists: { include: { songs: true } } },
      });
      // 곡 수 집계
      return categories.map((cat: any) => ({
        ...cat,
        songCount: cat.artists.reduce((sum: number, artist: any) => sum + artist.songs.length, 0),
      }));
    }),
});
