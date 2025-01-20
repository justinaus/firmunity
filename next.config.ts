import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/posts',
        permanent: false,
      },
    ];
  },
  i18n: {
    locales: ['default', 'en', 'ko'],
    defaultLocale: 'default',
    localeDetection: false, // 자동 리다이렉션 끄기. 미들웨어에서 처리.
  },
};

export default nextConfig;
