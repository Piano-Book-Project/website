import { initTRPC } from '@trpc/server';
import { logger } from '../utils/logger';

const t = initTRPC.create();

// 요청/응답 로깅 미들웨어
const loggingMiddleware = t.middleware(async ({ path, type, next, rawInput, ctx }) => {
  logger.info(`[${type}] ${path} - input: ${JSON.stringify(rawInput)}`);
  const result = await next();
  logger.info(`[${type}] ${path} - result: ${JSON.stringify(result?.ok ? result.data : result.error)}`);
  return result;
});

export const router = t.router;
export const procedure = t.procedure.use(loggingMiddleware); 