import { z } from 'zod';
import { router, procedure } from '../trpc';

export const mainVisualRouter = router({
  // 메인 비주얼 목록 조회
  list: procedure.query(async ({ ctx }) => {
    try {
      const mainVisuals = await ctx.db.mainVisual.findMany({
        include: {
          category: true,
          artist: true,
          song: true,
        },
        orderBy: {
          order: 'asc',
        },
      });

      return mainVisuals.map((mv) => ({
        id: mv.id,
        code: mv.code,
        category: mv.category.name,
        categoryId: mv.categoryId,
        artistName: mv.artist?.name || '-',
        artistId: mv.artistId,
        songName: mv.song?.title || '-',
        songId: mv.songId,
        displayType: mv.displayType,
        imageUrl: mv.imageUrl,
        youtubeUrl: mv.youtubeUrl,
        streamingUrl: mv.streamingUrl,
        isLive: mv.isLive,
        liveStatus: mv.liveStatus,
        createdAt: mv.createdAt.toLocaleString('ko-KR'),
        createdBy: mv.createdBy,
        updatedAt: mv.updatedAt.toLocaleString('ko-KR'),
        updatedBy: mv.updatedBy,
        isActive: mv.isActive,
      }));
    } catch (error) {
      console.error('Error fetching main visuals:', error);
      throw new Error('메인 비주얼 목록을 가져오는 중 오류가 발생했습니다.');
    }
  }),

  // 메인 비주얼 상세 조회
  get: procedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    try {
      const mainVisual = await ctx.db.mainVisual.findUnique({
        where: { id: input.id },
        include: {
          category: true,
          artist: true,
          song: true,
        },
      });

      if (!mainVisual) {
        throw new Error('메인 비주얼을 찾을 수 없습니다.');
      }

      return {
        id: mainVisual.id,
        code: mainVisual.code,
        category: mainVisual.category.name,
        categoryId: mainVisual.categoryId,
        artistName: mainVisual.artist?.name || '-',
        artistId: mainVisual.artistId,
        songName: mainVisual.song?.title || '-',
        songId: mainVisual.songId,
        displayType: mainVisual.displayType,
        imageUrl: mainVisual.imageUrl,
        youtubeUrl: mainVisual.youtubeUrl,
        streamingUrl: mainVisual.streamingUrl,
        isLive: mainVisual.isLive,
        liveStatus: mainVisual.liveStatus,
        createdAt: mainVisual.createdAt.toLocaleString('ko-KR'),
        createdBy: mainVisual.createdBy,
        updatedAt: mainVisual.updatedAt.toLocaleString('ko-KR'),
        updatedBy: mainVisual.updatedBy,
        isActive: mainVisual.isActive,
      };
    } catch (error) {
      console.error('Error fetching main visual:', error);
      throw new Error('메인 비주얼을 가져오는 중 오류가 발생했습니다.');
    }
  }),

  // 메인 비주얼 생성
  create: procedure
    .input(
      z.object({
        code: z.string(),
        categoryId: z.number(),
        artistId: z.number().optional(),
        songId: z.number().optional(),
        displayType: z.enum(['image', 'youtube', 'streaming']),
        imageUrl: z.string().optional(),
        youtubeUrl: z.string().optional(),
        streamingUrl: z.string().optional(),
        isActive: z.boolean(),
        liveStatus: z.enum(['online', 'offline']).default('offline'),
        createdBy: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // 다음 순서 계산
        const maxOrder = await ctx.db.mainVisual.aggregate({
          _max: { order: true },
        });

        const newOrder = (maxOrder._max.order || 0) + 1;

        const mainVisual = await ctx.db.mainVisual.create({
          data: {
            code: input.code,
            categoryId: input.categoryId,
            artistId: input.artistId || null,
            songId: input.songId || null,
            displayType: input.displayType,
            imageUrl: input.imageUrl || null,
            youtubeUrl: input.youtubeUrl || null,
            streamingUrl: input.streamingUrl || null,
            isActive: input.isActive,
            isLive: input.displayType === 'streaming',
            liveStatus: input.liveStatus,
            order: newOrder,
            createdBy: input.createdBy,
            updatedBy: input.createdBy,
          },
        });

        return mainVisual;
      } catch (error) {
        console.error('Error creating main visual:', error);
        throw new Error('메인 비주얼을 생성하는 중 오류가 발생했습니다.');
      }
    }),

  // 메인 비주얼 수정
  update: procedure
    .input(
      z.object({
        id: z.number(),
        code: z.string(),
        categoryId: z.number(),
        artistId: z.number().optional(),
        songId: z.number().optional(),
        displayType: z.enum(['image', 'youtube', 'streaming']),
        imageUrl: z.string().optional(),
        youtubeUrl: z.string().optional(),
        streamingUrl: z.string().optional(),
        isActive: z.boolean(),
        liveStatus: z.enum(['online', 'offline']).default('offline'),
        updatedBy: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const mainVisual = await ctx.db.mainVisual.update({
          where: { id: input.id },
          data: {
            code: input.code,
            categoryId: input.categoryId,
            artistId: input.artistId || null,
            songId: input.songId || null,
            displayType: input.displayType,
            imageUrl: input.imageUrl || null,
            youtubeUrl: input.youtubeUrl || null,
            streamingUrl: input.streamingUrl || null,
            isActive: input.isActive,
            isLive: input.displayType === 'streaming',
            liveStatus: input.liveStatus,
            updatedBy: input.updatedBy,
            updatedAt: new Date(),
          },
        });

        return mainVisual;
      } catch (error) {
        console.error('Error updating main visual:', error);
        throw new Error('메인 비주얼을 수정하는 중 오류가 발생했습니다.');
      }
    }),

  // 메인 비주얼 삭제
  delete: procedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    try {
      await ctx.db.mainVisual.delete({
        where: { id: input.id },
      });
      return { success: true };
    } catch (error) {
      console.error('Error deleting main visual:', error);
      throw new Error('메인 비주얼을 삭제하는 중 오류가 발생했습니다.');
    }
  }),

  // 메인 비주얼 순서 업데이트
  updateOrder: procedure
    .input(z.object({ items: z.array(z.object({ id: z.number(), order: z.number() })) }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.$transaction(
          input.items.map(({ id, order }) =>
            ctx.db.mainVisual.update({
              where: { id },
              data: { order },
            }),
          ),
        );
        return { success: true };
      } catch (error) {
        console.error('Error updating main visual order:', error);
        throw new Error('메인 비주얼 순서를 업데이트하는 중 오류가 발생했습니다.');
      }
    }),

  // 스트리밍 상태 확인
  checkLiveStatus: procedure.input(z.object({ url: z.string() })).query(async ({ input }) => {
    try {
      const response = await fetch(input.url, {
        method: 'GET',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      });

      if (!response.ok) {
        return { liveStatus: 'offline' as const };
      }

      const html = await response.text();
      const hasLiveContainer = html.includes('live_information_video_container__E3LbD');
      const hasDimmedContainer = html.includes('live_information_video_dimmed__Hrmtd');
      const isLive = hasLiveContainer && !hasDimmedContainer;

      return { liveStatus: isLive ? ('online' as const) : ('offline' as const) };
    } catch (error) {
      console.error('Error checking live status:', error);
      return { liveStatus: 'offline' as const };
    }
  }),

  // User 앱용 메인 비주얼 데이터 조회
  getUserMainVisual: procedure.query(async ({ ctx }) => {
    try {
      const mainVisuals = await ctx.db.mainVisual.findMany({
        where: { isActive: true },
        include: {
          category: true,
          artist: true,
          song: true,
        },
        orderBy: { order: 'asc' },
      });

      // 카테고리별로 그룹화
      const categoryGroups = mainVisuals.reduce(
        (acc: any, mv: any) => {
          const categoryName = mv.category.name;
          if (!acc[categoryName]) {
            acc[categoryName] = [];
          }
          acc[categoryName].push({
            id: mv.id,
            code: mv.code,
            category: mv.category.name,
            artist: mv.artist?.name || null,
            song: mv.song?.title || null,
            displayType: mv.displayType,
            imageUrl: mv.imageUrl,
            youtubeUrl: mv.youtubeUrl,
            streamingUrl: mv.streamingUrl,
            isLive: mv.isLive,
            liveStatus: mv.liveStatus,
          });
          return acc;
        },
        {} as Record<string, any[]>,
      );

      // 메인 비주얼이 등록된 카테고리만 반환
      const categories = Object.keys(categoryGroups);

      return {
        categories,
        mainVisuals: categoryGroups,
      };
    } catch (error) {
      console.error('Error fetching user main visual data:', error);
      throw new Error('메인 비주얼 데이터를 가져오는 중 오류가 발생했습니다.');
    }
  }),
});
