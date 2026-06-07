'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#0a0a0a',
            color: '#f5f0e8',
            fontSize: '13px',
            borderRadius: '2px',
            border: '1px solid rgba(201,169,110,0.2)',
            padding: '12px 20px',
          },
        }}
      />
    </QueryClientProvider>
  );
}