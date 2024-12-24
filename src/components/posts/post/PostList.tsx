import { Divider, Stack } from '@mantine/core';
import { Fragment } from 'react';

import { PostsItem } from '@/pages/api/posts';

import Post from './Post';

type Props = {
  datas: PostsItem[];
};

export default function PostList({ datas }: Props) {
  return (
    <Stack gap={'xl'}>
      {datas.map((postData, index) => (
        <Fragment key={postData.id}>
          <Post data={postData} />
          {index !== datas.length - 1 && <Divider size={'xs'} />}
        </Fragment>
      ))}
    </Stack>
  );
}

function PostsSkeleton() {
  return (
    <Stack gap={'xl'}>
      <Post.Skeleton />
      <Divider size={'xs'} />
      <Post.Skeleton />
      <Divider size={'xs'} />
      <Post.Skeleton />
    </Stack>
  );
}

PostList.Skeleton = PostsSkeleton;
