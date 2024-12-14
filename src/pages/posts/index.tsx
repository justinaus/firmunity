import Head from 'next/head';

import Content from '@/components/posts/Content';
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
          <Content />
        </PageLayout.Main>
      </PageLayout>
    </>
  );
}
