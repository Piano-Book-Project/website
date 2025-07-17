import { router } from '../trpc';
import { adminRouter } from './admin';
import { permissionRouter } from './permission';
import { menuAccessRouter } from './menuAccess';
import { userRouter } from './user';
import { playlistRouter } from './playlist';
import { artistRouter } from './artist';
import { songRouter } from './song';

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
