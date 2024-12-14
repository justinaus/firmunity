import Head from 'next/head';

import PageLayout from '@/components/shared/layout/PageLayout';

export default function PostNew() {
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
        {/* <PageLayout.Header /> */}
        <PageLayout.Main>New</PageLayout.Main>
      </PageLayout>
    </>
  );
}
