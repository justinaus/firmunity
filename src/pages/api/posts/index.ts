import { Post, User } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

import { prismaClient } from '@/helpers/prisma';
import { ApiResponse, Pagination } from '@/types/api';

import { authOptions } from '../auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      return handleGet(req as unknown as GetPostsRequest, res);
    case 'POST':
      return handlePost(req, res);
    default:
      return res.status(405).json({ error: { message: 'Method not allowed' } });
  }
}

async function handlePost(
  req: NextApiRequest,
  res: NextApiResponse<PostPostsResponse>
) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.email) {
      return res.status(401).json({
        error: { message: 'Unauthorized' },
      });
    }

    const { title, content, image } = req.body as PostPostsRequestBody;

    if (!title || !content) {
      return res.status(400).json({
        error: { message: 'Title, content are required' },
      });
    }

    await prismaClient.post.create({
      data: {
        title,
        content,
        image,
        author: {
          connect: {
            email: session?.user?.email,
          },
        },
      },
    });

    res.status(200).json({ data: { success: true } });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: { message: 'An unexpected error occurred' } });
  }
}

export type PostPostsRequestBody = {
  title: string;
  content: string;
  image?: string;
};

export type PostPostsResponse = ApiResponse<{
  success: boolean;
}>;

async function handleGet(
  req: GetPostsRequest,
  res: NextApiResponse<GetPostsResponse>
) {
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

export type PostsItem = Post & {
  author: Pick<User, 'email' | 'nickname' | 'image'>;
};

export type GetPostsRequest = Omit<NextApiRequest, 'query'> & {
  query: {
    page: number;
    countPerPage: number;
  };
};

export type GetPostsResponse = ApiResponse<{
  posts: PostsItem[];
  pagination: Pagination;
}>;
