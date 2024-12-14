import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

import PostNewContent from '@/components/posts/new/Content';
import PageLayout from '@/components/shared/layout/PageLayout';

export default function PostNew() {
  const { push } = useRouter();

  const { data: session, status } = useSession();

  useEffect(() => {
    if (session) return;
    if (status === 'loading') return;

    push({
      pathname: '/login',
      query: {
        redirect: '/posts/new',
      },
    });
  }, [push, session, status]);

  return (
    <>
      <Head>
        <title>Post New</title>
      </Head>
      <PageLayout
        header={{
          height: 0,
        }}
      >
        <PageLayout.Main>
          <PostNewContent />
        </PageLayout.Main>
      </PageLayout>
    </>
  );
}
