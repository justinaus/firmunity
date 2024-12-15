import { ImageAnnotatorClient } from '@google-cloud/vision';
import { put, PutBlobResult } from '@vercel/blob';
import formidable from 'formidable';
import { readFile } from 'fs/promises';
import type { NextApiRequest, NextApiResponse, PageConfig } from 'next';
import { getServerSession } from 'next-auth';

import { ApiResponse } from '@/types/api';

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

    // FormData 파싱
    const form = formidable();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [fields, files] = await form.parse(req);
    const file = files.file?.[0];

    if (!file) {
      return res.status(400).json({ error: { message: 'No file uploaded' } });
    }

    // 파일을 버퍼로 읽기
    const fileBuffer = await readFile(file.filepath);

    const client = new ImageAnnotatorClient({ credentials });

    const [result] = await client.safeSearchDetection(fileBuffer);

    const detections = result.safeSearchAnnotation;

    const isInappropriate =
      detections?.adult === 'VERY_LIKELY' ||
      detections?.violence === 'VERY_LIKELY' ||
      detections?.spoof === 'VERY_LIKELY' ||
      detections?.medical === 'VERY_LIKELY';

    if (isInappropriate) {
      return res.status(400).json({
        error: { message: 'Inappropriate content detected' },
      });
    }

    const blob = await put(req.query.filename, fileBuffer, {
      access: 'public',
    });

    res.status(200).json({
      data: blob,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log('Credentials error:', {
        errorMessage: err.message,
        errorName: err.name,
        credentialsExists: !!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON,
      });
    } else {
      console.log('Unknown error:', err);
    }

    res
      .status(500)
      .json({ error: { message: 'An unexpected error occurred' } });
  }
}

const credentials = JSON.parse(
  process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || ''
);

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

// 1. adult: 성인 콘텐츠, 나체, 선정적 내용
// - 노출이 심한 이미지나 성인용 콘텐츠를 감지
// 2. spoof: 속임수나 가짜 콘텐츠
// - 스팸, 피싱, 사기성 이미지
// - 의도적으로 조작된 이미지나 밈(meme)
// 3. medical: 의료 관련 콘텐츠
// - 수술 장면
// - 의료 시술 이미지
// - 상처나 질병 관련 이미지
// 4. violence: 폭력적인 콘텐츠
// - 무기
// - 폭력적인 장면
// - 유혈 사진
// - 부상이나 사고 장면
// 5. racy: 선정적이지만 성인물은 아닌 콘텐츠
// - 수영복 착용 사진
// - 가벼운 노출이 있는 이미지
// - 성적 암시가 있는 콘텐츠
