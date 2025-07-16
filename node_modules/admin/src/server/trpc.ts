import { initTRPC, MiddlewareFunction, MiddlewareParams, MiddlewareNext } from '@trpc/server';
import { logger } from '../utils/logger';

const t = initTRPC.create();

// 요청/응답 로깅 미들웨어
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LoggingParams = MiddlewareParams<any, any> & { path: string; type: string; next: MiddlewareNext<any>; rawInput: unknown };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const loggingMiddleware: MiddlewareFunction<any> = async ({ path, type, next, rawInput }: LoggingParams) => {
  logger.info(`[${type}] ${path} - input: ${JSON.stringify(rawInput)}`);
  const result = await next();
  logger.info(`[${type}] ${path} - result: ${JSON.stringify(result?.ok ? result.data : result.error)}`);
  return result;
};

export const router = t.router;
export const procedure = t.procedure.use(loggingMiddleware); 