import '@/styles/globals.css';
import '@mantine/core/styles.css';

import { createTheme, MantineProvider } from '@mantine/core';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';

import AppLayout from '@/components/shared/layout/AppLayout';

import { pretendard } from './fonts/pretendard/pretendard';

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
      <MantineProvider theme={theme}>
        <AppLayout className={pretendard.className}>
          <Component {...pageProps} />
        </AppLayout>
      </MantineProvider>
    </SessionProvider>
  );
}
