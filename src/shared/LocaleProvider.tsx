import { useRouter } from 'next/router';
import { createContext, PropsWithChildren, useContext } from 'react';

import { Messages } from '@/constants/locales/types';

// context 타입 정의
type LocaleContextType = {
  messages: Messages;
  locale: string;
};

// Context 생성
const LocaleContext = createContext<LocaleContextType | null>(null);

type Props = {
  messages: Messages;
};

export function LocaleProvider({
  children,
  messages,
}: PropsWithChildren<Props>) {
  const { locale = 'en' } = useRouter();

  return (
    <LocaleContext.Provider
      value={{
        messages,
        locale,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export const useLocale = () => {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }

  return context;
};
