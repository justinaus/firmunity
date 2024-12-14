import { Button, Group, Stack, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

import { axiosInstance } from '@/helpers/axios';
import { PostPostsRequestBody, PostPostsResponse } from '@/pages/api/posts';

type FormValues = {
  title: string;
  content: string;
};

export default function PostNewContent() {
  const { push } = useRouter();

  const { mutate, isPending } = useMutation<
    AxiosResponse<PostPostsResponse>,
    undefined,
    FormValues
  >({
    mutationFn: (values: FormValues) => {
      return axiosInstance.post(`/api/posts`, {
        title: values.title,
        content: values.content,
      } as PostPostsRequestBody);
    },
    onSuccess: (result) => {
      // TODO. 에러 처리.
      if (!result.data.data?.success) return;

      push('/posts');
    },
  });

  const form = useForm<FormValues>({
    mode: 'uncontrolled',
    initialValues: {
      title: '',
      content: '',
    },
    validate: {
      title: (value) =>
        value.length < 2 ? 'Title must have at least 2 letters' : null,
      content: (value) =>
        value.length < 2 ? 'Content must have at least 2 letters' : null,
    },
  });

  const handleFormSubmit = useCallback(
    (values: FormValues) => {
      if (isPending) return;

      mutate(values);
    },
    [isPending, mutate]
  );

  return (
    <form onSubmit={form.onSubmit(handleFormSubmit)}>
      <Stack gap={'lg'}>
        <TextInput
          withAsterisk
          label="Title"
          placeholder="Add a title"
          key={form.key('title')}
          {...form.getInputProps('title')}
          disabled={isPending}
        />

        <Textarea
          withAsterisk
          label="Content"
          placeholder="Write something..."
          key={form.key('content')}
          {...form.getInputProps('content')}
          autosize
          minRows={4}
          disabled={isPending}
        />
      </Stack>

      <Group justify="flex-end" mt="md">
        <Button type="submit" disabled={isPending}>
          Submit
        </Button>
      </Group>
    </form>
  );
}
