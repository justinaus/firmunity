import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;

const locales = ['ko', 'en'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.includes('/api/') ||
    PUBLIC_FILE.test(req.nextUrl.pathname) ||
    locales.some((locale) => pathname.startsWith(`/${locale}`))
  ) {
    return;
  }

  if (req.nextUrl.locale !== 'default') return;

  const acceptLanguage = req.headers.get('accept-language') || '';

  let locale = 'en'; // 기본값.

  const preferredLocale = acceptLanguage
    .split(',')
    .map((lang) => lang.split(';')[0].split('-')[0])
    .find((lang) => locales.includes(lang));

  if (preferredLocale) {
    locale = preferredLocale;
  }

  return NextResponse.redirect(
    new URL(`/${locale}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url)
  );
}
