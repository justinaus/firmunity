import '@/styles/globals.css';
import '@mantine/core/styles.css';

import { createTheme, MantineProvider } from '@mantine/core';
import { QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';

import { pretendard } from '@/assets/fonts/pretendard/pretendard';
import AppLayout from '@/components/shared/layout/AppLayout';
import { queryClient } from '@/helpers/query';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const theme = createTheme({
    /** Put your mantine theme override here */
    fontFamily: 'pretendard, sans-serif',
  });

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <MantineProvider theme={theme}>
          <AppLayout className={pretendard.className}>
            <Component {...pageProps} />
          </AppLayout>
        </MantineProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
