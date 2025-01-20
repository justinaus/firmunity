import {
  AppShell,
  AppShellHeaderProps,
  AppShellMainProps,
  AppShellProps,
  Button,
  Container,
  Flex,
} from '@mantine/core';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';

import Logo from '../logo/Logo';

type Props = AppShellProps;

export default function PageLayout({ ...rest }: Props) {
  return <AppShell header={{ height: 70 }} {...rest} />;
}

function Header({ ...rest }: Omit<AppShellHeaderProps, 'children'>) {
  const { data: session } = useSession();

  return (
    <AppShell.Header bd={'none'} {...rest}>
      <Container size={'xs'} h={'100%'} px={'lg'}>
        <Flex align={'center'} justify={'space-between'} h={'100%'}>
          <Link
            href="/"
            style={{
              textDecoration: 'none',
            }}
          >
            <Logo />
          </Link>
          {session ? (
            <Button size="compact-xs" color="gray" onClick={() => signOut()}>
              Sign out
            </Button>
          ) : (
            <Button size="compact-xs" onClick={() => signIn()}>
              Sign in
            </Button>
          )}
        </Flex>
      </Container>
    </AppShell.Header>
  );
}

function Main({ children, ...rest }: AppShellMainProps) {
  return (
    <AppShell.Main {...rest}>
      <Container size={'xs'} pt={'md'} pb={'xl'} px={'lg'}>
        {children}
      </Container>
    </AppShell.Main>
  );
}

PageLayout.Header = Header;
PageLayout.Main = Main;
