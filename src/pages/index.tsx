import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Test</title>
      </Head>
      <div
        style={{
          overscrollBehavior: 'none',
        }}
      >
        Hello
        <div
          style={{
            height: 500,
          }}
        >
          111
        </div>
        <div
          style={{
            height: 500,
          }}
        >
          222
        </div>
        <div
          style={{
            height: 500,
          }}
        >
          333
        </div>
        <div
          style={{
            height: 500,
          }}
        >
          444
        </div>
        <div
          style={{
            height: 500,
          }}
        >
          555
        </div>
      </div>
    </>
  );
}
