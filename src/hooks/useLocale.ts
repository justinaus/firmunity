import { useRouter } from 'next/router';

// 모든 locale 데이터가 초기 번들에 포함되어 번들 크기가 커짐
// 불필요한 locale 데이터도 함께 로드됨
// First Paint 시간이 길어질 수 있음
import en from '@/constants/locales/en';
import ko from '@/constants/locales/ko';

export const useLocale = () => {
  const { locale } = useRouter();
  const data = locale === 'ko' ? ko : en;

  return { data, locale };
};
