import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import React from 'react';
import { createRoot } from 'react-dom/client';
import type { AppRouter } from 'schema/src/trpc';
import './styles/global.scss';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

const trpc = createTRPCReact<AppRouter>();

const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: '/api/trpc', // ← 프록시를 위해 상대경로로 변경
    }),
  ],
});

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </trpc.Provider>
    </QueryClientProvider>
  </React.StrictMode>,
);
