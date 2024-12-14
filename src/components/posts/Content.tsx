import { ActionIcon, Affix } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

import { axiosInstance } from '@/helpers/axios';
import { GetPostsResponse } from '@/pages/api/posts';

import Post from './post/Post';

export default function Content() {
  const path = '/api/posts?page=1&countPerPage=10';

  const { data, error } = useQuery<GetPostsResponse>({
    queryKey: [path],
    queryFn: async () => {
      const response = await axiosInstance.get(path);
      return response.data;
    },
  });

  return (
    <div>
      {data?.data?.posts.map((postData) => (
        <Post key={postData.id} data={postData} />
      ))}
      <Affix
        position={{
          bottom: 30,
          left: '50%',
        }}
      >
        <div
          style={{
            transform: 'translateX(-50%)',
          }}
        >
          <ActionIcon
            size={'xl'}
            radius={'xl'}
            component={Link}
            href={`/posts/new`}
          >
            <IconPlus />
          </ActionIcon>
        </div>
      </Affix>
    </div>
  );
}
