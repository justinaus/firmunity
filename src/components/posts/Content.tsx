import { ActionIcon, Affix, Divider, Stack } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import {
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
} from '@tanstack/react-query';
import Link from 'next/link';
import { Fragment, useMemo } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { axiosInstance } from '@/helpers/axios';
import { GetPostsResponse } from '@/pages/api/posts';

import Post from './post/Post';

const COUNT_PER_PAGE = 10;

export default function Content() {
  const apiPath = '/api/posts';

  const { data, fetchNextPage, hasNextPage, error } = useInfiniteQuery<
    GetPostsResponse,
    undefined,
    InfiniteData<GetPostsResponse>,
    QueryKey,
    {
      nextPage: number;
    }
  >({
    queryKey: [apiPath],
    queryFn: async ({ pageParam }) => {
      const response = await axiosInstance.get<GetPostsResponse>(
        `${apiPath}?page=${pageParam.nextPage}&countPerPage=${COUNT_PER_PAGE}`
      );
      return response.data;
    },
    initialPageParam: { nextPage: 1 },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
      if (!lastPage.data?.pagination) {
        return undefined;
      }

      const totalPage = Math.ceil(
        lastPage.data.pagination.totalCount / COUNT_PER_PAGE
      );

      if (lastPage.data.pagination.page >= totalPage) {
        return undefined;
      }

      return {
        nextPage: lastPage.data.pagination.page + 1,
      };
    },
  });

  const datas = useMemo(() => {
    return data?.pages.flatMap((pageItem) => pageItem.data?.posts || []);
  }, [data?.pages]);

  return (
    <>
      <InfiniteScroll
        dataLength={datas?.length || 0} //This is important field to render the next data
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={null}
      >
        <Stack gap={'xl'}>
          {datas?.map((postData, index) => (
            <Fragment key={postData.id}>
              <Post data={postData} />
              {index !== datas.length - 1 && <Divider size={'xs'} />}
            </Fragment>
          ))}
        </Stack>
      </InfiniteScroll>
      <BottomButton />
    </>
  );
}

function BottomButton() {
  return (
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
  );
}
