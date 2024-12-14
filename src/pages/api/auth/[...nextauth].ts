import { Provider } from '@prisma/client';
import nextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import { prismaClient } from '@/helpers/prisma';

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async signIn({ user, account, profile }) {
      if (!user.email || !account) return false;

      try {
        // 이미 존재하는 유저인지 확인
        const existingUser = await prismaClient.user.findUnique({
          where: { email: user.email },
        });

        if (existingUser) {
          return true;
        }

        if (!user.name || !user.email) {
          throw new Error('signIn error: something wrong');
        }

        if (account.provider !== 'google') {
          throw new Error('signIn error: invalid provider');
        }

        await prismaClient.user.create({
          data: {
            email: user.email,
            name: user.name,
            image: user.image,
            nickname: user.email,
            account: {
              create: {
                provider: Provider.GOOGLE,
                providerAccountId: account.providerAccountId,
              },
            },
          },
        });

        return true;
      } catch (error) {
        console.error('signIn error', error);
        return false;
      }
    },
  },
};

export default nextAuth(authOptions);
