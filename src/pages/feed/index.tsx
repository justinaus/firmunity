import Head from 'next/head';

import PageLayout from '@/components/shared/layout/PageLayout';

export default function Feed() {
  return (
    <>
      <Head>
        <title>Feed</title>
      </Head>
      <PageLayout>
        <PageLayout.Header />
        <PageLayout.Main>111</PageLayout.Main>
      </PageLayout>
    </>
  );
}
