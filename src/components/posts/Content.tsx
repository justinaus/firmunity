import { useQuery } from '@tanstack/react-query';

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
    </div>
  );
}
