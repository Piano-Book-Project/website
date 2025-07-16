import { createTRPCReact } from '@trpc/react-query';
// import type { AppRouter } from '../../../admin/src/server/routers';

// 타입 충돌 방지를 위해 임시로 any 사용 (실제 서비스에서는 타입 공유 패키지로 분리 권장)
export const trpc = createTRPCReact<any>(); 