import { initTRPC } from '@trpc/server';
import { logger } from '../utils/logger';

const t = initTRPC.create();

// 요청/응답 로깅 미들웨어 (t.middleware 사용, input으로 변경)
const loggingMiddleware = t.middleware(async ({ path, type, next, input }) => {
  logger.info(`[${type}] ${path} - input: ${JSON.stringify(input)}`);
  const result = await next();
  logger.info(
    `[${type}] ${path} - result: ${JSON.stringify(result?.ok ? result.data : result.error)}`,
  );
  return result;
});

export const router = t.router;
export const procedure = t.procedure.use(loggingMiddleware);
