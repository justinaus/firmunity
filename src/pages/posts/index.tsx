import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { Suspense } from 'react';

import Content from '@/components/posts/Content';
import PostList from '@/components/posts/post/PostList';
import PageLayout from '@/components/shared/layout/PageLayout';
import { Messages } from '@/constants/locales/types';
import { LocaleProvider } from '@/shared/LocaleProvider';

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  // 모든 페이지 요청마다 서버에서 locale 파일을 import
  // Time to First Byte (TTFB)가 약간 늘어날 수 있음
  const messages = (await import(`@/constants/locales/${ctx.locale || 'en'}`))
    .default;

  return {
    props: {
      messages: messages,
    },
  };
}

type Props = {
  messages: Messages;
};

export default function Posts({ messages }: Props) {
  return (
    <>
      <Head>
        <title>Posts</title>
      </Head>
      <LocaleProvider messages={messages}>
        <PageLayout>
          <PageLayout.Header />
          <PageLayout.Main>
            <Suspense fallback={<PostList.Skeleton />}>
              <Content />
            </Suspense>
          </PageLayout.Main>
        </PageLayout>
      </LocaleProvider>
    </>
  );
}
