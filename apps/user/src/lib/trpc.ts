import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from 'schema/src/trpc';

export const trpc = createTRPCReact<AppRouter>();
