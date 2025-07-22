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
  next: procedure
    .input(z.object({ userId: z.number(), currentSongId: z.number() }))
    .query(async ({ input }) => {
      const { userId, currentSongId } = input;
      // 1. 해당 유저의 플레이리스트를 playedAt 오름차순으로 가져옴
      const playlist = await prisma.playlist.findMany({
        where: { userId },
        orderBy: { playedAt: 'asc' },
        include: { song: { include: { artist: true } } },
      });
      if (!playlist.length) {
        throw new TRPCError({ code: 'NOT_FOUND', message: '플레이리스트에 곡이 없습니다.' });
      }
      // 2. 현재 곡의 인덱스 찾기
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const idx = playlist.findIndex((item: any) => item.songId === currentSongId);
      if (idx === -1) {
        throw new TRPCError({ code: 'NOT_FOUND', message: '현재 곡이 플레이리스트에 없습니다.' });
      }
      // 3. 다음 곡 인덱스 (마지막 곡이면 첫 곡으로 순환)
      const nextIdx = (idx + 1) % playlist.length;
      const nextSong = playlist[nextIdx].song;
      if (!nextSong) {
        throw new TRPCError({ code: 'NOT_FOUND', message: '다음 곡 정보를 찾을 수 없습니다.' });
      }
      return nextSong;
    }),
  prev: procedure
    .input(z.object({ userId: z.number(), currentSongId: z.number() }))
    .query(async ({ input }) => {
      const { userId, currentSongId } = input;
      const playlist = await prisma.playlist.findMany({
        where: { userId },
        orderBy: { playedAt: 'asc' },
        include: { song: { include: { artist: true } } },
      });
      if (!playlist.length) {
        throw new TRPCError({ code: 'NOT_FOUND', message: '플레이리스트에 곡이 없습니다.' });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const idx = playlist.findIndex((item: any) => item.songId === currentSongId);
      if (idx === -1) {
        throw new TRPCError({ code: 'NOT_FOUND', message: '현재 곡이 플레이리스트에 없습니다.' });
      }
      // 이전 곡 인덱스 (첫 곡이면 마지막 곡으로 순환)
      const prevIdx = (idx - 1 + playlist.length) % playlist.length;
      const prevSong = playlist[prevIdx].song;
      if (!prevSong) {
        // 예외: 이전 곡이 없으면 현재 곡 반환
        return playlist[idx].song;
      }
      return prevSong;
    }),
});
