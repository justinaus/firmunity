import Head from 'next/head';
import { Suspense } from 'react';

import Content from '@/components/posts/Content';
import PostList from '@/components/posts/post/PostList';
import PageLayout from '@/components/shared/layout/PageLayout';

export default function Posts() {
  return (
    <>
      <Head>
        <title>Posts</title>
      </Head>
      <PageLayout>
        <PageLayout.Header />
        <PageLayout.Main>
          <Suspense fallback={<PostList.Skeleton />}>
            <Content />
          </Suspense>
        </PageLayout.Main>
      </PageLayout>
    </>
  );
}
