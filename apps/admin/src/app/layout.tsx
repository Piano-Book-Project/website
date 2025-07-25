'use client';

import '../styles/global.scss';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import ClientLayout from '../components/ClientLayout';
import { trpc, createTrpcClient } from '../utils/trpc';

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <trpc.Provider client={createTrpcClient()} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <ClientLayout>{children}</ClientLayout>
          </QueryClientProvider>
        </trpc.Provider>
      </body>
    </html>
  );
}
