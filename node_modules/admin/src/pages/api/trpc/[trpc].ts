import { createNextApiHandler } from '@trpc/server/adapters/next';
import { appRouter } from '../../../server/routers';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5174');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  return createNextApiHandler({
    router: appRouter,
    createContext: () => ({}),
  })(req, res);
} 