import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { createRoot } from 'react-dom/client';
import type { AppRouter } from 'schema/src/trpc';
import './styles/global.scss';
import ErrorBoundary from './components/ErrorBoundary';
import Router from './router';

const trpc = createTRPCReact<AppRouter>();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: '/api/trpc',
    }),
  ],
});

const root = createRoot(document.getElementById('root')!);

root.render(
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <Router />
      </trpc.Provider>
    </QueryClientProvider>
  </ErrorBoundary>,
);
