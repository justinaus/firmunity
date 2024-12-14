import { Post, User } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

import { prismaClient } from '@/helpers/prisma';
import { ApiResponse, Pagination } from '@/types/\bapi';

export default async function handler(
  req: GetPostsRequest,
  res: NextApiResponse<GetPostsResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: { message: 'Method not allowed' } });
  }

  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.countPerPage) || 1;
    const skip = (page - 1) * limit;

    const [posts, totalCount] = await Promise.all([
      prismaClient.post.findMany({
        take: limit,
        skip: skip,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              email: true,
              nickname: true,
              image: true,
            },
          },
        },
      }),
      prismaClient.post.count(),
    ]);

    res.status(200).json({
      data: {
        posts,
        pagination: {
          page,
          countPerPage: limit,
          totalCount: totalCount,
        },
      },
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: { message: 'An unexpected error occurred' } });
  }
}

type PostItem = Post & {
  author: Pick<User, 'email' | 'nickname' | 'image'>;
};

export type GetPostsRequest = Omit<NextApiRequest, 'query'> & {
  query: {
    page: number;
    countPerPage: number;
  };
};

export type GetPostsResponse = ApiResponse<{
  posts: PostItem[];
  pagination: Pagination;
}>;
