import { router } from '../trpc';
import { adminRouter } from './admin';
import { artistRouter } from './artist';
import { menuAccessRouter } from './menuAccess';
import { permissionRouter } from './permission';
import { playlistRouter } from './playlist';
import { songRouter } from './song';
import { userRouter } from './user';

export const appRouter = router({
  admin: adminRouter,
  permission: permissionRouter,
  menuAccess: menuAccessRouter,
  user: userRouter,
  playlist: playlistRouter,
  artist: artistRouter,
  song: songRouter,
});

export type AppRouter = typeof appRouter;
