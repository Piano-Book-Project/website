import { router } from '../trpc';
import { artistRouter } from './artist';
import { categoryRouter } from './category';
import { playlistRouter } from './playlist';
import { songRouter } from './song';
import { tagRouter } from './tag';

export const appRouter = router({
  song: songRouter,
  artist: artistRouter,
  category: categoryRouter,
  playlist: playlistRouter,
  tag: tagRouter,
});

export type AppRouter = typeof appRouter;
