import { Button } from '@mantine/core';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import { useCallback, useEffect } from 'react';

import PageLayout from '@/components/shared/layout/PageLayout';
import { getOneString } from '@/utils/string';

export default function Login() {
  const { back, query } = useRouter();

  const { data: session, status } = useSession();

  const handleClickSignIn = useCallback(() => {
    const redirect = getOneString(query.redirect) || '/';

    signIn('google', {
      callbackUrl: redirect,
    });
  }, [query.redirect]);

  useEffect(() => {
    if (!session) return;

    back();
  }, [back, session, status]);

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <PageLayout
        header={{
          height: 0,
        }}
      >
        <PageLayout.Main>
          <Button size="xl" radius={'xl'} onClick={handleClickSignIn}>
            Sign in
          </Button>
        </PageLayout.Main>
      </PageLayout>
    </>
  );
}
