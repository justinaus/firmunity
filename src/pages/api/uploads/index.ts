import { put, PutBlobResult } from '@vercel/blob';
import type { NextApiRequest, NextApiResponse, PageConfig } from 'next';
import { getServerSession } from 'next-auth';

import { ApiResponse } from '@/types/\bapi';

import { authOptions } from '../auth/[...nextauth]';

export default async function handler(
  req: PostUploadsRequest,
  res: NextApiResponse<PostUploadsResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method not allowed' } });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.email) {
      return res.status(401).json({
        error: { message: 'Unauthorized' },
      });
    }

    const blob = await put(req.query.filename, req, {
      access: 'public',
    });

    res.status(200).json({
      data: blob,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: { message: 'An unexpected error occurred' } });
  }
}

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};

export type PostUploadsRequest = Omit<NextApiRequest, 'query'> & {
  query: {
    filename: string;
  };
};

export type PostUploadsResponse = ApiResponse<PutBlobResult>;
